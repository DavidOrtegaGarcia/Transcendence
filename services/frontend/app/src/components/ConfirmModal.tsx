/* This component uses React Portal to render the modal outside the main DOM hierarchy z-9999 */
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void; 
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

const ConfirmModal = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar",
    isDanger = false
}: ConfirmModalProps) => {
    
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100 relative z-10">
                
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                    {title}
                </h3>
                
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                    {message}
                </p>
                
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel}
                        className="btn-icon btn-secondary px-4 py-2 text-sm"
                    >
                        {cancelText}
                    </button>

                    <button 
                        onClick={onConfirm}
                        className={`btn-icon px-4 py-2 text-sm font-bold text-white shadow-lg 
                            ${isDanger ? 'btn-danger bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white' : 'btn-primary'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
		document.body
    );
};

export default ConfirmModal;