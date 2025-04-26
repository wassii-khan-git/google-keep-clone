import Navbar from "./(components)/navbar";
import Form from "./home/form";
// Home Page
export default function Home() {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <div className="container mx-auto p-4  mt-24">
        {/* Tables */}
        <Form />
      </div>
    </>
  );
}
