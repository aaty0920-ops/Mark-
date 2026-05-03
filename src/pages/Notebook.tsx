export default function Notebook() {
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notebook</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          New Note
        </button>
      </div>
      
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">Important Concepts - Chapter {i}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Last edited 2 days ago
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
