import * as taskDependencyRepository from "../repositories/taskDependency.repository.js";
import * as projectMemberService from "./projectMember.service.js";
import { isTaskCompleted } from "../utils/task.utils.js";

const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
}
const validate = (id,fieldName = "ID") => {
    const NumberId = Number(id);
     if (!Number.isInteger(numberId) || numberId <= 0) {
        throw createError(`${fieldName} không hợp lệ.`);
    }

    return numberId;
}
const getTaskOrThrow = async (taskId) => {
    
}