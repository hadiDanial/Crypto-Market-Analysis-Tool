import React, { useState } from "react";
import Button from "./Button";
import InputDate from "./InputDate";
import Loading from "./Loading";

const Chart = () => {
  const [fromDate, setFromDate] = useState<Date>();
  const [untilDate, setUntilDate] = useState<Date>();
  return (
    <main className="container mx-auto px-6 py-8 ">
      <section className="mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 my-6">
          Explore the Crypto World
        </h2>
        <div className="mx-auto flex flex-wrap items-end gap-6 mb-6">
          <div>
            From:
            <InputDate setDate={setFromDate} maxDate={untilDate} />
          </div>

          <div>
            Until:
            <InputDate setDate={setUntilDate} minDate={fromDate} />
          </div>
          <div>
            <Button
              name={"Update Data"}
              onClick={() => {
                alert("Clicked");
              }}
            ></Button>
          </div>
        </div>
        <Loading></Loading>

        <canvas id="chart"></canvas>
      </section>
    </main>
  );
};

export default Chart;
