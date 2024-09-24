import Header from "../components/Header";
import EntranceFee from "../components/Entrance";

function HomePage() {
  return (
    <div>
      <Header />
      <div>
        <EntranceFee />
      </div>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </div>
  );
}

export default HomePage;
