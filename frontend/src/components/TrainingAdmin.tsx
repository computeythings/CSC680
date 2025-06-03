import TrainingVideo from "./TrainingVideo";

export default function TrainingAdmin() {
  return (
      <div className="w-full content-center ">
          <div className="w-full content-center">
              <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                  <div className="flex flex-col w-full text-center">
                      <h1 className="text-3xl font-bold my-4">How to Add User</h1>
                      <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-add-user.mp4" />
                      <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                          <li>From the Home page, click the Users link in the sidebar</li>
                          <li>Next Click the Add User sub-menu</li>
                          <li>Enter the new user's info and click submit</li>
                          <li>The form will be cleared on successful add</li>
                      </ol>
                  </div>
              </div>
          </div>
          <div className="w-full content-center my-2">
              <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                  <div className="flex flex-col w-full text-center">
                      <h1 className="text-3xl font-bold my-4">How to Update User</h1>
                      <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-update-user.mp4" />
                      <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                          <li>From the Users page, click the Update User link in the sidebar</li>
                          <li>Enter the username of the user you wish to update</li>
                          <li>The user's info will be populated excluding their password and role for security reasons</li>
                          <li>After entering all information, hit submit</li>
                          <li>The form will be cleared on successful add</li>
                      </ol>
                  </div>
              </div>
          </div>
          <div className="w-full content-center my-2">
              <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                  <div className="flex flex-col w-full text-center">
                      <h1 className="text-3xl font-bold my-4">How to Delete User</h1>
                      <TrainingVideo src="https://csc680-public-resources.s3.us-west-1.amazonaws.com/how-to-delete-user.mp4" />
                      <ol className="list-decimal list-inside text-left mx-auto font-bold my-4">
                          <li>From the Users page, click the Delete User link in the sidebar</li>
                          <li>Enter the username of the user you wish to delete</li>
                          <li>The user's info will be populated excluding their password and role for security reasons</li>
                          <li>Confirm this is the desired user and click delete</li>
                      </ol>
                  </div>
              </div>
          </div>
      </div>
  );
}
