import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import './css/projectForm.css';


function ProjectForm() {
    const[project, setProject] = useState({
        projectName: '',
        projectImage: '',
        projectLink: ''
    });

    const handleInput = (e) => {
        const { name, value } = e.target; 
        setProject({ ...project, [name]: value });
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {            
            const reader = new FileReader();
            reader.onloadend = () => {
                setProject({ ...project, projectImage: reader.result }); 
            };
            reader.readAsDataURL(file); 
        }
    };

    
    function handleSubmit(e) {
        e.preventDefault();
        console.log(project);
        axios.post('http://localhost:5000/projects', project)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="project-form-page">
            <div className="container">
                <h1>Add Project</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project Name:</label>
                        <input
                            type="text"
                            name="projectName"
                            className="form-control"
                            onChange={handleInput}
                            value={project.projectName}
                            placeholder="Enter Project Name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Project Image:</label>
                        <input
                            type="file"
                            name="projectImage"
                            className="form-control-file"
                            onChange={handleFileChange}
                            accept=".jpg, .jpeg, .png, .svg"
                        />
                    </div>
                    <div className="form-group">
                        <label>Project Link:</label>
                        <input
                            type="text"
                            name="projectLink"
                            className="form-control"
                            onChange={handleInput}
                            value={project.projectLink}
                            placeholder="Enter Project Link"
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm;