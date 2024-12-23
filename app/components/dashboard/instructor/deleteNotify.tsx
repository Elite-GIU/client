import Cookies from 'js-cookie';

// Confirmation Dialog function using Promise
const showConfirmationDialog = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmationDialog = document.createElement('div');
    confirmationDialog.style.position = 'fixed';
    confirmationDialog.style.top = '0';
    confirmationDialog.style.left = '0';
    confirmationDialog.style.width = '100%';
    confirmationDialog.style.height = '100%';
    confirmationDialog.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    confirmationDialog.style.display = 'flex';
    confirmationDialog.style.justifyContent = 'center';
    confirmationDialog.style.alignItems = 'center';
    confirmationDialog.style.zIndex = '1000';

    const dialogBox = document.createElement('div');
    dialogBox.style.backgroundColor = '#fff';
    dialogBox.style.padding = '30px'; // Increased padding for larger dialog
    dialogBox.style.borderRadius = '15px'; // Larger border radius for a more modern look
    dialogBox.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)'; // Subtle shadow for the dialog box
    dialogBox.style.textAlign = 'center';
    dialogBox.style.minWidth = '300px'; // Set a minimum width for the dialog
    dialogBox.style.maxWidth = '500px'; // Max width to prevent it from becoming too large
    dialogBox.style.color = 'black'; // Set the text color to black
    dialogBox.style.fontSize = '18px'; // Slightly larger font size for better readability

    dialogBox.innerHTML = `
      <h3 style="color: black; font-size: 20px; font-weight: bold;">${message}</h3>
      <input id="confirmInput" type="text" placeholder="Type 'Delete' to delete" style="margin: 20px 0; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; width: 80%;" />
      <div id="errorMessage" style="color: red; font-size: 14px; display: none;"></div>
      <div>
        <button id="confirmBtn" style="margin: 15px 20px; padding: 15px 25px; cursor: pointer; font-size: 16px; border: none; background-color: #ff4433; color: white; border-radius: 5px;">Delete</button>
        <button id="cancelBtn" style="margin: 15px 20px; padding: 15px 25px; cursor: pointer; font-size: 16px; border: none; background-color: #4CAF50; color: white; border-radius: 5px;">Cancel</button>
      </div>
    `;

    confirmationDialog.appendChild(dialogBox);
    document.body.appendChild(confirmationDialog);

    const confirmBtn = document.getElementById('confirmBtn')!;
    const cancelBtn = document.getElementById('cancelBtn')!;
    const confirmInput = document.getElementById('confirmInput') as HTMLInputElement;
    const errorMessage = document.getElementById('errorMessage')!;

    confirmBtn.onclick = () => {
      if (confirmInput.value.trim() === 'Delete') {
        resolve(true);
        document.body.removeChild(confirmationDialog); // Close the dialog
      } else {
        errorMessage.textContent = 'You must type "Delete" to proceed.';
        errorMessage.style.display = 'block'; // Show the error message in red
      }
    };

    cancelBtn.onclick = () => {
      resolve(false);
      document.body.removeChild(confirmationDialog); // Close the dialog
    };
  });
};

// Delete course function
const deleteCourse = async (
  id: string,
  setCourses: Function,
  setError: Function
) => {
  const token = Cookies.get('Token');

  const isConfirmed = await showConfirmationDialog(
    'Are you sure you want to delete this course?'
  );

  if (!isConfirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/instructor/course/${id}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      const reason = response.headers.get('Content-Type')?.includes('application/json')
        ? await response.json()
        : { error: { message: 'Failed to delete course' } };

      throw new Error(reason.error?.message || 'Failed to delete course');
    }

    // Update the state
    setCourses((prevCourses: any) =>
      prevCourses.filter((course: any) => course._id !== id)
    );

  } catch (error) {
    console.error('Error deleting course:', error);
    setError((error as Error).message);
  }
};

export { deleteCourse };
