import { ArrowUpIcon } from "lucide-react"
import { Button } from "./components/ui/button"

function App() {

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button variant="outline">Button</Button>
      </div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App