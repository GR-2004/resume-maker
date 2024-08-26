import React, { useEffect, useState } from "react";
import PortfolioPage from "./PortfolioPage";
import Modal from "../component/Modal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Header from "../component/Header";
import InputCard from "../component/InputCard";
import TextareaCard from "../component/TextareaCard";

const FormDataPage = () => {
  const [dataObject, setDataObject] = useState({
    id: "",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { id } = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const resume = await axios.get(
        "http://localhost:3000/api/resume/getResume",
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setDataObject((prev) => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...dataObject.projects];
    updatedProjects[index][field] = value;
    setDataObject((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const addProject = () => {
    setDataObject((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "" }],
    }));
  };

  const removeProject = (index) => {
    const updatedProjects = dataObject.projects.filter((_, i) => i !== index);
    setDataObject((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append file object directly
      if (dataObject.image) {
        formData.append("image", dataObject.image);
      }

      // Append other fields
      formData.append("name", dataObject.name);
      formData.append("college", dataObject.college);
      formData.append("email", dataObject.email);
      formData.append("phone", dataObject.phone);
      formData.append("experience", dataObject.experience);
      formData.append("github", dataObject.github);
      formData.append("linkedin", dataObject.linkedin);
      formData.append("skills", dataObject.skills);

      // Append projects as JSON string
      formData.append("projects", JSON.stringify(dataObject.projects));

      const response = await axios.post(
        "http://localhost:3000/api/resume/saveResume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setDataObject(response.data);
      toast.success("Resume generated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 justify-center items-start bg-gradient-to-r from-indigo-50 to-indigo-100 min-h-screen py-12 px-6">
        {/* Form Section */}
        <div className="w-full lg:w-2/5 px-4">
          <div className="max-w-lg bg-white shadow-xl rounded-lg p-10 space-y-8">
            <h1 className="text-4xl text-center font-extrabold text-indigo-600">
              Resume Maker
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Profile Picture */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* basic details */}
              <InputCard
                id="name"
                label="Full Name"
                type="text"
                value={dataObject.name}
                handleInputChange={handleInputChange}
              />
              <InputCard
                id="email"
                label="Email Address"
                type="email"
                value={dataObject.email}
                handleInputChange={handleInputChange}
              />
              <InputCard
                id="phone"
                label="Phone Number"
                type="tel"
                value={dataObject.phone}
                handleInputChange={handleInputChange}
                pattern="\d{10}"
                required={true}
              />

              <InputCard
                id="college"
                label="College Name"
                type="text"
                value={dataObject.college}
                handleInputChange={handleInputChange}
              />
              <InputCard
                id="linkedin"
                label="LinkedIn Profile"
                type="url"
                value={dataObject.linkedin}
                handleInputChange={handleInputChange}
              />
              <InputCard
                id="github"
                label="Github Profile"
                type="url"
                value={dataObject.github}
                handleInputChange={handleInputChange}
              />

              {/* skills */}
              <TextareaCard
                id="skills"
                label="Skills"
                value={dataObject.skills}
                handleInputChange={handleInputChange}
              />
              <TextareaCard
                id="experience"
                label="Experience"
                value={dataObject.experience}
                handleInputChange={handleInputChange}
              />

              {/* Projects */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Projects
                </h2>
                {dataObject?.projects?.map((project, index) => (
                  <div key={index} className="space-y-4">
                    <input
                      type="text"
                      name={`projectTitle${index}`}
                      placeholder={`Project Title ${index + 1}`}
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, "title", e.target.value)
                      }
                      className="p-3 block w-full border border-gray-300 rounded-lg"
                    />
                    <textarea
                      name={`projectDescription${index}`}
                      placeholder={`Project Description ${index + 1}`}
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="p-3 block w-full border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Project
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Project
                </button>
              </div>

              {/* Generate Resume Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Resume
              </button>
            </form>
            {/* JSON Button */}
            <button
              onClick={openModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full mt-4"
            >
              JSON
            </button>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(dataObject, null, 2)}
                </pre>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </Modal>
          </div>
        </div>

        {/* Portfolio Section */}
        <PortfolioPage dataObject={dataObject} imagePreview={imagePreview} />

        {/* Toast Notifications */}
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
    </>
  );
};

export default FormDataPage;
