/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="section">
      <div className="container lg:grid lg:grid-cols-2 items-center lg:gap-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-rounded dark:text-zinc-100">
              task_alt
            </span>
            <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-300 text-sm tracking-wide">
              <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
              </span>
              Available for work
            </div>
          </div>
          <h2 className="headline-1 max-w-[15ch] sm:max-w-[24ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10 text-center md:text-left">
            Crafting Scalable, High-Performance Websites Optimized for the
            Future of Digital Innovation
          </h2>
          <Button className="h-11 mx-auto md:mx-0 flex items-center gap-x-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 hover:border-2 hover:border-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover-border-2 dark:hover:border-zinc-100 cursor-pointer">
            Download CV
            <span className="material-symbols-rounded">download</span>
          </Button>
        </div>
        <div className="hidden lg:block">
          <figure className="w-full max-w-[480px] ml-auto bg-gradient-to-t from-zinc-900 via-25% via-zinc-700 to-70% rounded-[20px] overflow-hidden shadow-2xl shadow-zinc-600">
            <img
              className="w-full"
              width={656}
              height={800}
              src="/images/hero.png"
              alt="Mihai Elisei"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
