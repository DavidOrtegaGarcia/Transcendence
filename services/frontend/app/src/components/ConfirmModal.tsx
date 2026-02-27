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
        <div className="modal-backdrop animate-fade-in">
    		<div className="modal-content max-w-sm p-6 scale-100">
                
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