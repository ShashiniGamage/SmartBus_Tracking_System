const Cards = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center space-x-4">
        {Icon && <Icon className="text-blue-500 w-8 h-8" />}
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;