

export const formateDate =(date,config)=>{
    const defaultOptions = {day:'numeric', month:'short', year:'numeric'}
    const options = config ? config :defaultOptions

    return new Date(date).toLocaleDateString('en-US', options)
}


export const formatDateSchedule = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate() < 9 ? `0${date.getDate()}` : date.getDate();
    let month = date.getMonth() < 9 ? `0${date.getMonth()}` : date.getMonth();
    return `${day}/${month}/${date.getFullYear()}`;
}