import React from "react";

const BlockCompletionModal = ({ currentBlock, totalBlocks, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Block Completed</h2>
        <p className="text-lg mb-6">
          You have completed {currentBlock}/{totalBlocks} blocks
        </p>
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Continue to Next Block
        </button>
      </div>
    </div>
  );
};

export default BlockCompletionModal;
