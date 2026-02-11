import { CgSpinner } from "react-icons/cg";

interface LoadingStateProps {
    message?: string;
}

const LoadingState = ({ message = "Cargando..." }: LoadingStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <CgSpinner className="w-10 h-10 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-400 text-lg font-medium animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default LoadingState;

