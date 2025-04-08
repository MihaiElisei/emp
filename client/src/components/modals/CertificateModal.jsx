/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 mx-auto my-auto bg-zinc-100 dark:bg-zinc-800  md:h-[80vh]  md:w-[90%] ring-2 flex justify-center items-center z-50 rounded-md">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg max-w-md w-full shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 material-symbols-rounded text-zinc-900 dark:text-zinc-100 text-lg font-semibold cursor-pointer"
        >
          close
        </button>
        <div className="flex flex-col items-center justify-center">
          <img
            src={certificate.imgSrc}
            alt={certificate.title}
            className="object-cover mb-4 rounded-md"
          />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {certificate.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {certificate.issuer}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {certificate.date}
          </p>
          {/* You can add more details here as needed */}
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
