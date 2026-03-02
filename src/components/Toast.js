
const Toast = ({ msg, handleShow, bgColor, txtColor }) => {
    return (
        <div className={`w-full p-4 ${bgColor} ${txtColor} rounded shadow-lg`}>
            <div className="flex justify-between items-start mb-2">
                <strong>{msg.title}</strong>
                <button className="ml-2 text-lg font-bold hover:opacity-70" onClick={handleShow}>&times;</button>
            </div>
            <div>{msg.msg}</div>
        </div>
    )
}

export default Toast