import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectMembers } from "../api/projectMember.api";
import { moveDocument } from "../api/document.api";
import useDocuments from "../hooks/useDocuments";
import useDocumentFolders from "../hooks/useDocumentFolders";
import DocumentHeader from "../components/documents/DocumentHeader";
import DocumentList from "../components/documents/DocumentList";
import DocumentUploadModal from "../components/documents/DocumentUploadModal";
import DocumentVersionModal from "../components/documents/DocumentVersionModal";
import DocumentVersionsModal from "../components/documents/DocumentVersionsModal";
import DocumentFolderModal from "../components/documents/DocumentFolderModal";
import MoveDocumentModal from "../components/documents/MoveDocumentModal";
import ConfirmDeleteItemModal from "../components/documents/ConfirmDeleteItemModal";
import {
    getSavedLanguage,
    getTranslations,
    listenForLanguageChange,
} from "../utils/language";

const DocumentsPage = () => {
    const { id: projectId } = useParams();
    const [language, setLanguage] = useState(
        getSavedLanguage()
    );
    const t = getTranslations(language);

    useEffect(() => {
        setLanguage(getSavedLanguage());

        const unsubscribe = listenForLanguageChange(
            setLanguage
        );

        return unsubscribe;
    }, []);
 
    const {
        documents,
        setDocuments,
        loading,
        loadDocuments,

        versions,
        loadingVersions,

        submitting,
        setSubmitting,

        selectedDocument,

        documentName,
        setDocumentName,
        file,
        setFile,
        changeNote,
        setChangeNote,

        editingDocumentId,
        editingName,
        setEditingName,

        createDocumentHandler,

        openVersionModal,
        createVersion,
        openVersions,

        startEditing,
        cancelEditing,
        updateDocumentHandler,

        deleteDocumentHandler,
    } = useDocuments(projectId);

    const {
    folders,
    loadFolders,

    showFolderModal,


    editingFolderId,

    folderSubmitting,

    openCreateFolderModal,
    openEditFolderModal,
    closeFolderModal,

    createFolderHandler,
    updateFolderHandler,
    deleteFolderHandler,
} = useDocumentFolders(
    projectId,
    loadDocuments
);
    const [userRole, setUserRole] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showVersionModal, setShowVersionModal] = useState(false);
    const [showVersionsModal, setShowVersionsModal] = useState(false);

    const [selectedFolderId, setSelectedFolderId] = useState(null);

    const [showMoveModal, setShowMoveModal] = useState(false);

    const [movingDocument, setMovingDocument] = useState(null);

    const [moveFolderId, setMoveFolderId] = useState(null);

    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteItemType, setDeleteItemType] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const openMoveModal = (document) => {
    setMovingDocument(document);
    setMoveFolderId(
        document.folderId ?? null
    );
    setShowMoveModal(true);
};

    const closeMoveModal = () => {
    if (submitting) return;

    setShowMoveModal(false);
    setMovingDocument(null);
    setMoveFolderId(null);
};

    const handleDeleteDocument = (document) => {
        setItemToDelete(document);
        setDeleteItemType('document');
    };

    const handleDeleteFolder = (folder) => {
        setItemToDelete(folder);
        setDeleteItemType('folder');
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete || !deleteItemType) return;

        try {
            setIsDeleting(true);

            if (deleteItemType === 'document') {
                await deleteDocumentHandler(itemToDelete);
            } else if (deleteItemType === 'folder') {
                await deleteFolderHandler(itemToDelete);
            }

            setItemToDelete(null);
            setDeleteItemType(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMoveDocument = async () => {
    if (!movingDocument) return;

    const targetFolderId = moveFolderId;

    console.log("========== MOVE DOCUMENT ==========");
    console.log("DOCUMENT ID:", movingDocument.id);
    console.log("CURRENT FOLDER:", movingDocument.folderId);
    console.log("TARGET FOLDER:", targetFolderId);
    console.log(
        "TARGET TYPE:",
        typeof targetFolderId
    );

    try {
        setSubmitting(true);

        const result = await moveDocument(
            movingDocument.id,
            targetFolderId
        );

        console.log("MOVE RESULT:", result);
        console.log(
            "RESULT FOLDER:",
            result.folderId
        );
        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === movingDocument.id
                    ? {
                          ...doc,
                          folderId:
                              result.folderId,
                      }
                    : doc
            )
        );

        closeMoveModal();
    } catch (error) {
        console.error(
            "❌ Error moving document:",
            error.response?.data || error
        );

        alert(
            error.response?.data?.message ||
                "Failed to move document."
        );
    } finally {
        setSubmitting(false);
    }
};
    const handleOpenVersionModal = (document) => {
    openVersionModal(document);
    setFile(null);
    setChangeNote("");
    setShowVersionModal(true);
};
    const handleOpenVersionsModal = async (document) => {
    const success = await openVersions(document);

    if (success) {
        setShowVersionsModal(true);
    }
};
    const loadUserRole = async () => {
    if (!projectId) return;

    try {
        const members = await getProjectMembers(projectId);

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            setUserRole(null);
            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        const currentUserId =
            Number(currentUser.userId);

        console.log("PROJECT MEMBERS:", members);
        console.log("CURRENT USER:", currentUser);
        console.log("CURRENT USER ID:", currentUserId);

        if (Number.isNaN(currentUserId)) {
            console.error(
                "Invalid current user ID:",
                currentUser
            );

            setUserRole(null);
            return;
        }

        const currentMember = members.find(
            (member) =>
                Number(member.userId) ===
                currentUserId
        );

        console.log(
            "CURRENT MEMBER:",
            currentMember
        );

        console.log(
            "USER ROLE:",
            currentMember?.role
        );

        setUserRole(
            currentMember?.role || null
        );

    } catch (error) {
        console.error(
            "Error loading user role:",
            error.response?.data || error
        );

        setUserRole(null);
    }
};

    useEffect(() => {
        loadDocuments();
        loadFolders();
        loadUserRole();
    }, [projectId]);

    const canCreateDocument =
        ["OWNER", "ADMIN", "MEMBER"].includes(
            userRole
        );

    const canEditDocument =
        ["OWNER", "ADMIN", "MEMBER"].includes(
            userRole
        );

    const canUploadVersion =
        ["OWNER", "ADMIN", "MEMBER"].includes(
            userRole
        );

    const canDeleteDocument =
        ["OWNER", "ADMIN"].includes(
            userRole
        );

    const canManageFolder =
        ["OWNER", "ADMIN"].includes(
            userRole
        );

    const getFileUrl = (fileUrl) => {
        if (!fileUrl) return "#";

        if (fileUrl.startsWith("http")) {
            return fileUrl;
        }

        const apiUrl =
            import.meta.env.VITE_API_URL;

        const baseUrl =
            apiUrl.replace("/api", "");

        return `${baseUrl}${fileUrl}`;
    };

    const isPreviewable = (fileType) => {
        if (!fileType) return false;

        return (
            fileType.startsWith("image/") ||
            fileType === "application/pdf" ||
            fileType.startsWith("text/")
        );
    };

    const handleDownload = async (version) => {
        try {
            const url =
                getFileUrl(version.fileUrl);

            const response =
                await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Download failed: ${response.status}`
                );
            }

            const blob =
                await response.blob();

            const blobUrl =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = blobUrl;
            link.download =
                version.fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(
                blobUrl
            );
        } catch (error) {
            console.error(
                "Download error:",
                error
            );

            alert(
                "Failed to download file."
            );
        }
    };

    return (
        <div className="p-6 space-y-6">

           <DocumentHeader
                t={t}
                canUploadDocument={canCreateDocument}
                canManageFolder={canManageFolder}
                onUpload={() => {
                    setSelectedFolderId(null);
                    setShowCreateModal(true);
                }}
                onCreateFolder={openCreateFolderModal}
            />
            <DocumentList
                t={t}
                documents={documents}
                folders={folders}
                loading={loading}

                canCreateDocument={canCreateDocument}
                canManageFolder={canManageFolder}
                canUploadVersion={canUploadVersion}
                canEditDocument={canEditDocument}
                canDeleteDocument={canDeleteDocument}

                onCreateDocument={(folderId) => {
                    setSelectedFolderId(folderId);
                    setShowCreateModal(true);
                }}

                onEditFolder={openEditFolderModal}
                onDeleteFolder={handleDeleteFolder}

                onUpdateDocument={updateDocumentHandler}
                onCancelEdit={cancelEditing}
                onUploadVersion={handleOpenVersionModal}
                onViewVersions={handleOpenVersionsModal}
                onEditDocument={startEditing}
                onMoveDocument={openMoveModal}
                onDeleteDocument={handleDeleteDocument}
                onDownload={handleDownload}

                editingDocumentId={editingDocumentId}
                editingName={editingName}
                setEditingName={setEditingName}
                submitting={submitting}

                isPreviewable={isPreviewable}
                getFileUrl={getFileUrl}
            />
            {showCreateModal && (
               <DocumentUploadModal
                    t={t}
                    documentName={documentName}
                    setDocumentName={setDocumentName}
                    file={file}
                    setFile={setFile}
                    changeNote={changeNote}
                    setChangeNote={setChangeNote}
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    setSelectedFolderId={setSelectedFolderId}
                    submitting={submitting}
                    onSubmit={() =>
                        createDocumentHandler(
                            selectedFolderId
                        )
                    }
                    onClose={() =>
                        setShowCreateModal(false)
                    }
                />
            )}

            {showVersionModal && (
                <DocumentVersionModal
                    t={t}
                    document={
                        selectedDocument
                    }
                    file={file}
                    setFile={setFile}
                    changeNote={changeNote}
                    setChangeNote={
                        setChangeNote
                    }
                    submitting={submitting}
                    onSubmit={createVersion}
                    onClose={() =>
                        setShowVersionModal(
                            false
                        )
                    }
                />
            )}

            {showVersionsModal && (
                <DocumentVersionsModal
                    t={t}
                    document={
                        selectedDocument
                    }
                    versions={versions}
                    loading={
                        loadingVersions
                    }
                    onDownload={
                        handleDownload
                    }
                    getFileUrl={
                        getFileUrl
                    }
                    isPreviewable={
                        isPreviewable
                    }
                    onClose={() =>
                        setShowVersionsModal(
                            false
                        )
                    }
                />
            )}
            {showMoveModal && (
                <MoveDocumentModal
                    t={t}
                    document={movingDocument}
                    folders={folders}
                    selectedFolderId={moveFolderId}
                    setSelectedFolderId={setMoveFolderId}
                    submitting={submitting}
                    onClose={closeMoveModal}
                    onSubmit={handleMoveDocument}
                />
            )}
            {showFolderModal && (
                    <DocumentFolderModal
                        t={t}
                        mode={editingFolderId ? "edit" : "create"}
                        folder={
                            editingFolderId
                                ? folders.find(
                                    (folder) =>
                                        folder.id === editingFolderId
                                )
                                : null
                        }
                        submitting={folderSubmitting}
                        onClose={closeFolderModal}
                        onSubmit={
                            editingFolderId
                                ? updateFolderHandler
                                : createFolderHandler
                        }
                    />
                )}
            <ConfirmDeleteItemModal
                t={t}
                item={itemToDelete}
                isOpen={!!itemToDelete}
                itemType={deleteItemType}
                isLoading={isDeleting}
                onConfirm={handleConfirmDelete}
                onClose={() => {
                    setItemToDelete(null);
                    setDeleteItemType(null);
                }}
            />
        </div>
    );
};
export default DocumentsPage;

