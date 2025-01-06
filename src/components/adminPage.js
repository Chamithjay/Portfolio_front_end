import ProjectForm from "./projectForm";
import SkillForm from "./skillForm";
import UserDetailForm from "./userDetailsForm";
import "./css/adminPage.css";

function AdminPage() {
  return (
    <div className="App">
      <ProjectForm />
      <SkillForm />
      <UserDetailForm />
    </div>
  );
}

export default AdminPage;
