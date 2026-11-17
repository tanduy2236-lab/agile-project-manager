import { useNavigate } from "react-router-dom";

const ProjectHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Projects
                </h1>

                <p className="text-gray-500 mt-2">
                    Create and manage your Agile projects.
                </p>
            </div>
            <button onClick={() => navigate("/projects/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                + New Project
            </button>
        </div>
    );
};
export default ProjectHeader;