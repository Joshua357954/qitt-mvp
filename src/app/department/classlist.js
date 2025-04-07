import { coursemates } from "@/utils/utils";

const NameInitial = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
      {initial}
    </div>
  );
};


const ClassTab = () => {
 
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Classmates</h2>
      <div className="space-y-3">
        {coursemates.map((mate) => (
          <div
            key={mate.id}
            className="flex items-center p-3 bg-white rounded-lg shadow"
          >
            <NameInitial name={mate.name} />
            <div className="ml-4">
              <div className="font-bold">{mate.name}</div>
              <div className="text-sm text-gray-500">
                {400} • Active {'12:35pm'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="font-semibold text-gray-800">
          Invite your classmates to join!
        </p>
        <p className="text-gray-700 mt-2">
          Share this link or send them a WhatsApp invite.
        </p>
      </div>
    </div>
  );
};

export default ClassTab;
