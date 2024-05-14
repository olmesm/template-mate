/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { template } from "lodash";

const REGX = /{([\s\S]+?)}/g;
const MOUSTACHE = "{ }";

export const App = () => {
  const [val, setVal] = useState("hello my name is {name}");
  const [inps, setInps] = useState<string[]>([]);
  const [inpVals, setInpVals] = useState<Record<string, any>>({});
  const [out, setOut] = useState("");

  useEffect(() => {
    let n = 0;
    setInps([]);

    while (n < 100) {
      n++;
      const foundTemplateVar = REGX.exec(val);

      if (!foundTemplateVar) {
        console.log("break", n);
        break;
      }

      setInps((s) => [...new Set([...s, foundTemplateVar[1]])]);
    }
  }, [val]);

  useEffect(() => {
    try {
      setOut(template(val, { interpolate: REGX })(inpVals));
    } catch (e) {
      console.error(e);
      if ((e as any).message) {
        return setOut((e as any).message.replace("defined", "set"));
      }
      setOut("There appears to be an error");
    }
  }, [inpVals, val]);

  return (
    <main className="container">
      <h1>Template Mate</h1>
      <p>
        Insert your template below. Use {MOUSTACHE} to define template variables
      </p>
      <div className="grid">
        <div>
          <textarea
            style={{ height: "100%" }}
            cols={30}
            rows={10}
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </div>
        <div>
          {inps.map((name, idx) => (
            <label>
              {name}
              <input
                type="text"
                key={idx}
                name={name}
                onChange={(e) =>
                  setInpVals((s) => ({ ...s, [name]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>
      </div>
      <h2>Output</h2>
      <textarea cols={30} rows={10} readOnly value={out} />
    </main>
  );
};
