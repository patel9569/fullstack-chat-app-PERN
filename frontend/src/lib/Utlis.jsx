export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    

  });
}

export function formatMessageDate(date){
  const givenDate = new Date(date)
  const todayDate = new Date();

  const givenDay = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate())
  const todayDay = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate())
  const diffTime= todayDay - givenDay


  const diffYes= diffTime / (1000 * 60 * 60 * 24)

  if(diffTime===0){
    return "Today"
  }
  else if( diffYes === 86400000 / (1000 * 60 * 60 * 24))
  {
    return "Yesterday"
  }
else{

  return givenDate.toLocaleDateString("en-IN",{
    day:"2-digit",
    month: "2-digit",
    year:"2-digit",
  })
}
}