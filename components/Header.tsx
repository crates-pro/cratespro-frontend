interface HeaderProps {
    onBack: () => void;
    title?: string; // Optional title prop
  }
  
  const Header = ({ onBack, title = "Crate Details" }: HeaderProps) => (
    <header className="bg-blue-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200"
        >
          Back
        </button>
      </div>
    </header>
  );
  
  export default Header;
  