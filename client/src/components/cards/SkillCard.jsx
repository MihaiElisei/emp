/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

const SkillCard = ({ imgSrc, label, desc, classes }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl ring-2 ring-inset ring-zinc-900 dark:ring-zinc-100 hover:bg-gradient-to-tl hover:from-zinc-500 hover:to-zinc-200 dark:hover:bg-gradient-to-br  dark:hover:from-zinc-800 dark:hover:to-zinc-600 transition-all transform hover:scale-105 hover:shadow-xl ${classes}`}
    >
      <figure className="flex justify-center items-center w-14 h-14 rounded-lg  p-2 transition-all">
        <img src={imgSrc} alt={label} className="w-10 h-10 object-contain" />
      </figure>
      <div>
        <h3 className="text-lg font-semibold  ">{label}</h3>
        <p className="text-sm">{desc}</p>
      </div>
    </div>
  );
};

export default SkillCard;
