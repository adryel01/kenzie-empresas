
export function toast(text, color){
    Toastify({
        text: text,
        duration: 3000,
        close: false,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: color
        }
    }).showToast()
}