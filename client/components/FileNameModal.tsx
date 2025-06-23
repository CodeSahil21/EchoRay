import React, { useState } from "react";

interface FileNameModalProps {
  open: boolean;
  initialValue?: string;
  title: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

const FileNameModal: React.FC<FileNameModalProps> = ({
  open,
  initialValue = "",
  title,
  confirmLabel = "Confirm",
  onClose,
  onConfirm,
}) => {
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-[#232946] p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[320px]">
        <h2 className="text-[#00ff88] font-semibold">{title}</h2>
        <input
          className="p-2 rounded border border-[#00ff88]/30 bg-[#181c2f] text-white"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-[#00ff88] text-[#181c2f] rounded font-semibold"
            onClick={() => {
              onConfirm(value.trim());
            }}
          >
            {confirmLabel}
          </button>
          <button
            className="px-4 py-2 bg-[#232946] text-[#00ff88] rounded font-semibold border border-[#00ff88]/30"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileNameModal;