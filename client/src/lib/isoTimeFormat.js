const isoTimeFormat=(dateTime)=>{
    const date = new Date(dateTime);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
}

export default isoTimeFormat