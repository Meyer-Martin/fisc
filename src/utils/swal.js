import Swal from "sweetalert2";

export function displaySuccessMessage(message) {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
    });
}

export function displayErrorMessage(message, error) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        footer: error
    })
}