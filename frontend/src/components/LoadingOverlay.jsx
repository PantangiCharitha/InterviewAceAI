function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center w-96">

        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-indigo-700">
          🤖 AI is analyzing your interview...
        </h2>

        <p className="mt-4 text-gray-600">
          Generating personalized feedback...
        </p>

      </div>

    </div>
  );
}

export default LoadingOverlay;