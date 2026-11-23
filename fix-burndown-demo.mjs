// fix-burndown-demo.mjs
// Chỉnh mốc thời gian của dữ liệu MẪU để Burndown Chart có đường giảm dần.
// Đặt ở THƯ MỤC GỐC dự án (cùng cấp package.json và thư mục prisma/). Xóa sau khi dùng.
//
//   node --env-file=.env fix-burndown-demo.mjs                    liệt kê các Sprint để chọn sprintId
//   node --env-file=.env fix-burndown-demo.mjs <sprintId>         xem trước, KHÔNG ghi
//   node --env-file=.env fix-burndown-demo.mjs <sprintId> --apply ghi vào cơ sở dữ liệu (có sao lưu)
//   node --env-file=.env fix-burndown-demo.mjs --restore          khôi phục từ burndown-backup.json

import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const prisma = new PrismaClient();
const BACKUP_FILE = 'burndown-backup.json';

// 12:00 trưa giờ Việt Nam (GMT+7) = 05:00 UTC, tránh bị lệch sang ngày khác
const SPRINT_START = new Date('2026-11-11T05:00:00.000Z');

// Ngày hoàn thành của 3 Task đang ở cột Done (tên phải khớp đúng tiêu đề Task)
const DONE_AT = {
  'Đăng ký tài khoản': new Date('2026-11-12T05:00:00.000Z'),
  'Thiết kế cơ sở dữ liệu sản phẩm': new Date('2026-11-13T05:00:00.000Z'),
  'Đăng nhập': new Date('2026-11-14T05:00:00.000Z'),
};

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const sprintId = Number(args.find((a) => /^\d+$/.test(a)));

const fmt = (d) => (d ? d.toISOString() : '-');

async function listSprints() {
  const groups = await prisma.task.groupBy({
    by: ['sprintId'],
    where: { sprintId: { not: null } },
    _count: { _all: true },
  });
  for (const g of groups) {
    const sample = await prisma.task.findMany({
      where: { sprintId: g.sprintId },
      select: { title: true },
      take: 3,
    });
    console.log(
      `sprintId=${g.sprintId}  (${g._count._all} task)  vd: ${sample.map((t) => t.title).join(' | ')}`
    );
  }
  console.log('\nChạy lại kèm sprintId, ví dụ: node --env-file=.env fix-burndown-demo.mjs 5');
}

async function buildPlan() {
  const tasks = await prisma.task.findMany({
    where: { sprintId },
    include: { taskHistories: { orderBy: { createdAt: 'asc' } } },
    orderBy: { id: 'asc' },
  });
  return tasks.map((t) => {
    const doneAt = DONE_AT[t.title];
    return {
      task: t,
      newCreatedAt: SPRINT_START,
      // Task đã Done: đặt ngày hoàn thành; Task khác: giữ nguyên updatedAt
      newUpdatedAt: doneAt ?? t.updatedAt,
      // Dòng lịch sử của Task đã Done được dời về ngày hoàn thành (giữ nguyên thứ tự)
      histories: doneAt
        ? t.taskHistories.map((h, i) => ({
            id: h.id,
            old: h.createdAt,
            next: new Date(doneAt.getTime() + i * 60_000),
          }))
        : [],
    };
  });
}

async function restore() {
  const b = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
  await prisma.$transaction([
    ...b.tasks.map((t) =>
      prisma.task.update({
        where: { id: t.id },
        data: { createdAt: new Date(t.createdAt), updatedAt: new Date(t.updatedAt) },
      })
    ),
    ...b.histories.map((h) =>
      prisma.taskHistory.update({
        where: { id: h.id },
        data: { createdAt: new Date(h.createdAt) },
      })
    ),
  ]);
  console.log('Đã khôi phục giá trị cũ.');
}

async function main() {
  if (args.includes('--restore')) return restore();
  if (!sprintId) return listSprints();

  const items = await buildPlan();
  if (items.length === 0) {
    console.log('Không có Task nào thuộc sprintId này.');
    return;
  }

  console.log(`Sprint ${sprintId}: ${items.length} Task\n`);
  for (const it of items) {
    const t = it.task;
    console.log(`#${t.id} "${t.title}"  status=${t.status}  SP=${t.storyPoint}`);
    console.log(`   createdAt: ${fmt(t.createdAt)} -> ${fmt(it.newCreatedAt)}`);
    console.log(`   updatedAt: ${fmt(t.updatedAt)} -> ${fmt(it.newUpdatedAt)}`);
    if (it.histories.length) {
      console.log(`   lịch sử: ${it.histories.length} dòng sẽ dời về ${fmt(it.histories[0].next)}`);
    }
  }

  const missing = Object.keys(DONE_AT).filter(
    (k) => !items.some((it) => it.task.title === k)
  );
  if (missing.length) console.log('\nCẢNH BÁO: không tìm thấy Task tên:', missing.join(', '));

  if (!apply) {
    console.log('\n(Chỉ xem trước. Thêm --apply để ghi vào cơ sở dữ liệu.)');
    return;
  }
  if (missing.length) {
    console.log('Dừng: sửa tên trong DONE_AT cho khớp rồi chạy lại.');
    return;
  }

  fs.writeFileSync(
    BACKUP_FILE,
    JSON.stringify(
      {
        tasks: items.map((it) => ({
          id: it.task.id,
          createdAt: it.task.createdAt,
          updatedAt: it.task.updatedAt,
        })),
        histories: items.flatMap((it) =>
          it.histories.map((h) => ({ id: h.id, createdAt: h.old }))
        ),
      },
      null,
      2
    )
  );
  console.log(`\nĐã sao lưu giá trị cũ vào ${BACKUP_FILE}`);

  await prisma.$transaction([
    ...items.map((it) =>
      prisma.task.update({
        where: { id: it.task.id },
        data: { createdAt: it.newCreatedAt, updatedAt: it.newUpdatedAt },
      })
    ),
    ...items.flatMap((it) =>
      it.histories.map((h) =>
        prisma.taskHistory.update({ where: { id: h.id }, data: { createdAt: h.next } })
      )
    ),
  ]);
  console.log('Xong. Tải lại trang Burndown để kiểm tra.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
