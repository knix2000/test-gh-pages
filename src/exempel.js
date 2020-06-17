
function App() {
  
  const [name,setName] = React.useState("Uffe")
 
  return (
    <>
        <input className="form-control" value={name} onChange=        {e=>setName(e.target.value)} />
      
      {name&&<h1>Hello, {name}!</h1>}
          </>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);