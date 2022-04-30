export const padToTwo = (number) => (number <= 9 ? `0${number}` : number);

export const displayTime = (seconds) => {
  if (seconds < 60) {
    return `00:00:${padToTwo(seconds)}`;
  }


  let remainSeconds = seconds % 60;
  let minutes = (seconds - remainSeconds) / 60;
  let remainingMinutes = minutes % 60
  if(minutes<60){
    return `00:${padToTwo(minutes)}:${padToTwo(seconds)}`;
  }
 
  let hours = (minutes - remainingMinutes) / 60

  return `${padToTwo(hours)}:${padToTwo(remainingMinutes)}:${padToTwo(remainSeconds)}`;
};

//converte un tempo nel formato hh:mm:ss in secondi
export const secondConverterTime = (time)=>{
  const duration = time.split(':')
  const ora = parseInt(duration[0],10)
  const minuto = parseInt(duration[1],10)
  const secondo =parseInt(duration[2],10) 
  const sommaTempoSecondi = ora*3600 + minuto*60 + secondo;
  return sommaTempoSecondi
}