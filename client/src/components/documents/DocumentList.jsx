import DocumentItem from "./DocumentItem";
import DocumentFolder from "./DocumentFolder";

const DocumentList = ({
    t,
    documents,
    folders,
    loading,

    canCreateDocument,
    canManageFolder,
    canUploadVersion,
    canEditDocument,
    canDeleteDocument,

    editingDocumentId,
    editingName,
    setEditingName,
    submitting,

    isPreviewable,
    getFileUrl,

    onCreateDocument,

    onEditFolder,
    onDeleteFolder,

    onUpdateDocument,
    onCancelEdit,
    onUploadVersion,
    onViewVersions,
    onEditDocument,
    onMoveDocument,
    onDeleteDocument,
    onDownload,
}) => {
    const docT = t?.documents || {};

    if (loading) {
        return (
            <div
                className="
                    rounded-xl
                    border border-slate-200
                    bg-white
                    p-8
                    text-center
                    text-sm
                    text-slate-500
                    shadow-sm
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-slate-400
                "
            >
                {docT.loading || "Loading documents..."}
            </div>
        );
    }

    const rootDocuments = documents.filter(
        (document) =>
            document.folderId === null ||
            document.folderId === undefined
    );

    return (
        <div className="space-y-4">

            {folders.map((folder) => {
                const folderDocuments = documents.filter(
                    (document) =>
                        Number(document.folderId) === Number(folder.id)
                );

                return (
                    <DocumentFolder
                        key={folder.id}
                        t={t}
                        folder={{
                            ...folder,
                            documents: folderDocuments,
                        }}
                        canManageFolder={canManageFolder}
                        canEditDocument={canEditDocument}
                        canUploadVersion={canUploadVersion}
                        canDeleteDocument={canDeleteDocument}
                        onCreateDocument={
                            canCreateDocument
                                ? onCreateDocument
                                : null
                        }
                        onEditFolder={onEditFolder}
                        onDeleteFolder={onDeleteFolder}
                        onUploadVersion={onUploadVersion}
                        onViewVersions={onViewVersions}
                        onEditDocument={onEditDocument}
                        onMoveDocument={onMoveDocument}
                        onDeleteDocument={onDeleteDocument}
                        onDownload={onDownload}
                        onUpdateDocument={onUpdateDocument}
                        onCancelEdit={onCancelEdit}
                        editingDocumentId={editingDocumentId}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        getFileUrl={getFileUrl}
                        isPreviewable={isPreviewable}
                    />
                );
            })}


            {rootDocuments.length > 0 && (
                <div
                    className="
                        rounded-xl
                        border border-slate-200
                        bg-white
                        shadow-sm
                        dark:border-slate-700
                        dark:bg-slate-800
                    "
                >
                    <div
                        className="
                            border-b border-slate-200
                            px-4 py-3
                            dark:border-slate-700
                        "
                    >
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            📄 {docT.unfiledDocuments || "Unfiled Documents"}
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {rootDocuments.length}{" "}
                            {rootDocuments.length === 1
                                ? docT.rootDocumentCount || "document"
                                : docT.rootDocumentsCount || "documents"}
                        </p>
                    </div>

                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {rootDocuments.map((document) => (
                            <DocumentItem
                                key={document.id}
                                t={t}
                                document={document}
                                editingDocumentId={editingDocumentId}
                                editingName={editingName}
                                setEditingName={setEditingName}
                                submitting={submitting}
                                canUploadVersion={canUploadVersion}
                                canEditDocument={canEditDocument}
                                canDeleteDocument={canDeleteDocument}
                                isPreviewable={isPreviewable}
                                getFileUrl={getFileUrl}
                                onUpdateDocument={onUpdateDocument}
                                onCancelEdit={onCancelEdit}
                                onUploadVersion={onUploadVersion}
                                onViewVersions={onViewVersions}
                                onEditDocument={onEditDocument}
                                onMoveDocument={onMoveDocument}
                                onDeleteDocument={onDeleteDocument}
                                onDownload={onDownload}
                            />
                        ))}
                    </div>
                </div>
            )}

            {folders.length === 0 &&
                rootDocuments.length === 0 && (
                    <div
                        className="
                            rounded-xl
                            border border-dashed border-slate-300
                            bg-white
                            p-10
                            text-center
                            dark:border-slate-600
                            dark:bg-slate-800
                        "
                    >
                        <div className="mb-2 text-4xl">
                            📁
                        </div>

                        <h3 className="font-semibold text-slate-800 dark:text-white">
                            {docT.noDocumentsYet || "No documents yet"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {docT.noDocumentsDescription || "Upload a document or create a folder to get started."}
                        </p>
                    </div>
                )}
        </div>
    );
};

export default DocumentList;