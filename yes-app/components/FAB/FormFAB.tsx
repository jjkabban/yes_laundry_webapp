import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FormFAB() {
  return (
    <div className="flex items-center fixed justify-center  bottom-6 left-1/2 -translate-x-1/2 z-40 lef-0 right-0  w-full">
      <motion.button
        key="form-fab"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
        }}
        className=" mt-8  bg-[white]/70 backdrop-blur-md border-[1] border-black/40 self-center rounded-full items-center max-w-fit flex flex-row gap-5 px-2  py-2"
      >
        <div className="flex flex-col px-3">
          <span className="font-semibold text-black text-sm">Pick up</span>
          <span className="text-black/60  text-[13px] ">Add location</span>
        </div>
        <div className="h-full w-[0.1] bg-gray-400" />
        <div className="flex flex-col">
          <span className="font-semibold text-black text-sm">Where</span>
          <span className="text-black/60 text-[13px]">Add address</span>
        </div>

        <div className="bg-brand h-full items-center flex p-2 rounded-full">
          <ArrowRight className="text-white" />
        </div>
      </motion.button>
    </div>
  );
}
