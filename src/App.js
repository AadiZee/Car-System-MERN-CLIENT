import Routes from "./routes/Routes";
import "./App.css";
//to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//to use react toastify notifications
import "react-toastify/dist/ReactToastify.css";
//Navbar
import Navbar from "./components/Navbar/Navbar";

//The main component of our app
const App = () => {
  return (
    <div>
      {/* Navbar Component displayed on top of page */}
      <Navbar />
      {/* App Routes */}
      <Routes />
    </div>
  );
};

export default App;
