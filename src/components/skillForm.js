import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import './css/skillForm.css';


function SkillForm() {
    const[skill, setSkill] = useState({
        skillName: '',
        skillExperience: ''
    });

    const handleInput = (e) => {
        const { name, value } = e.target; 
        setSkill({ ...skill, [name]: value });
    }

   

    
    function handleSubmit(e) {
        e.preventDefault();
        console.log(skill);
        axios.post('http://localhost:5000/skills', skill)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="skill-form-page">
            <div className="container">
                <h1>Skill Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                        <label>Skill Name:</label>
                        <input
                            type="text"
                            name="skillName"
                            className="form-control"
                            onChange={handleInput}
                            value={skill.skillName}
                            placeholder="Enter Skill Name"
                        />
                    </div>
                    <div className="form-group row">
                        <label>Skill Experience:</label>
                        <input
                            type="text"
                            name="skillExperience"
                            className="form-control"
                            onChange={handleInput}
                            value={skill.skillExperience}
                            placeholder="Enter your experience level"
                        />
                    </div>
                    <div className="form-group row">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default SkillForm;