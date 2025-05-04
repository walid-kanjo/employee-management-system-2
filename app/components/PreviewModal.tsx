interface PreviewModalProps {
  url: string;
  type: 'image' | 'doc';
  onClose: () => void;
}

export default function PreviewModal({
  url,
  type,
  onClose,
}: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-md max-w-2xl w-full relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 px-4 py-1.5 bg-green-600 text-white border border-green-700 dark:bg-green-500 dark:border-green-600 hover:bg-green-700 font-semibold rounded-md shadow text-sm"
        >
          Back
        </button>
        {type === 'image' ? (
          <img
            src={url}
            alt="Preview"
            className="w-full h-auto max-h-[80vh] object-contain mt-12"
          />
        ) : (
          <iframe
            src={url}
            title="Document Preview"
            className="w-full h-[80vh] rounded mt-12"
          />
        )}
      </div>
    </div>
  );
}
