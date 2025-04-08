/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

const CertificateCard = ({ imgSrc, title, issuer, date }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-tl from-zinc-500 to-zinc-200 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-600  rounded-md shadow-lg">
      <img
        src={imgSrc}
        alt={title}
        className="w-full object-cover mb-4 rounded-md"
      />
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-900 dark:text-zinc-100">{issuer}</p>
      <p className="text-xs text-zinc-900 dark:text-zinc-100">{date}</p>
    </div>
  );
};

export default CertificateCard;
