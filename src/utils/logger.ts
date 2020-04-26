export const logger = (...parmas: any[]) =>{
 parmas.forEach( (param , index)=> console.log(`index ${index} has`, param))
}