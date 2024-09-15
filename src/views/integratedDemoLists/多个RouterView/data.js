let num=2;


let ins={
    name:"11"
}

setTimeout(()=>{
    ins.name=3
    console.log("内部的ins",ins)
},1000)

export {ins,num}