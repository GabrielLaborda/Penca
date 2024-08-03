import PropTypes from "prop-types";
import CreateUserGroup from "./CreateUserGroup";
import JoinUserGroup from "./JoinUserGroup";

function UserGroups({ token, userId }) {
  return (
    <>
      <h2 className="text-center title">Grupos</h2>
      <CreateUserGroup token={token} userId={userId} />
      <JoinUserGroup token={token} userId={userId} />
    </>
  );
}
UserGroups.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
export default UserGroups;
