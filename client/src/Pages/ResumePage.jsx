import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ResumePage = () => {
  const [dataObject, setDataObject] = useState({
    _id: "",
    name: "",
    email: "",
    college: "",
    skills: "",
    phone: "",
    image: "",
    experience: "",
    linkedin: "",
    github: "",
    projects: [{ title: "", description: "" }],
  });
  const options = {
    filename: dataObject.name + ".pdf" || "resume.pdf",
    margin: 0.5,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true, // Add this option to enable CORS for cross-origin images
      logging: true,
    },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const { id } = useParams();
  const contentRef = useRef(null);

  const convertToPdf = () => {
    const content = contentRef.current;

    // Small delay before generating the PDF to ensure all images are fully loaded
    setTimeout(() => {
      html2pdf().set(options).from(content).save();
    }, 500);
  };

  useEffect(() => {
    if(id){
        fetchData(id);
    } else {
        toast.error("id not found")
    }
  }, [id]);

  const fetchData = async (id) => {
    try {
      const resume = await axios.get(
        `http://localhost:3000/api/resume/getResumeFromId?id=${id}`,
        { withCredentials: true }
      );
      if (!resume || !resume.data) {
        toast.error("Resume not found");
        return;
      }
      setDataObject(resume.data);
      toast.success("User fetched successfully");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (!dataObject) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700">Loading...</h1>
          <p className="text-gray-500">Fetching your portfolio data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-6 px-6 mx-auto bg-gray-100">
      <div
        ref={contentRef}
        className="bg-white border shadow-lg rounded-lg p-10 max-w-4xl mx-auto mt-10"
      >
        <div className="flex items-center mb-8">
          <div className="flex-shrink-0 mr-8">
            <img
              src={dataObject.image}
              alt="resume-image"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {dataObject.name || "Your Name"}
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {dataObject.college || "Your College"}
            </p>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3 mb-5">
            Summary
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Skills:</strong> {dataObject.skills || "Your Skills"}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Experience:</strong>{" "}
            {dataObject.experience || "Your Experience"}
          </p>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3 mb-5">
            Projects
          </h2>
          {dataObject.projects && dataObject.projects.length > 0 ? (
            dataObject.projects.map((project, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {project.title}
                </h3>
                <p className="text-lg text-gray-600 mt-2">
                  {project.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects added yet.</p>
          )}
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-800 border-b pb-3 mb-5">
            Links
          </h2>
          <p className="text-lg text-gray-700 mb-3">
            <strong>LinkedIn:</strong>{" "}
            <a
              href={dataObject.linkedin}
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dataObject.linkedin || "Your LinkedIn Profile"}
            </a>
          </p>
          <p className="text-lg text-gray-700 mb-3">
            <strong>GitHub:</strong>{" "}
            <a
              href={dataObject.github}
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dataObject.github || "Your GitHub Profile"}
            </a>
          </p>
          <p className="text-lg text-gray-700 mb-3">
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${dataObject.email}`}
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dataObject.email || "Your Email Address"}
            </a>
          </p>
          <p className="text-lg text-gray-700">
            <strong>WhatsApp:</strong>{" "}
            <a
              href={`https://wa.me/${dataObject.phone}`}
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dataObject.phone || "Your WhatsApp Number"}
            </a>
          </p>
        </div>
      </div>
      <button
        onClick={convertToPdf}
        className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Download PDF
      </button>
      <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
    </div>
  );
};

export default ResumePage;
