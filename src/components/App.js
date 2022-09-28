import {
  Select,
  Slider,
  InputNumber,
  Typography,
  Button,
  Input,
  Table,
} from "antd";
import { stringify } from "csv-stringify/browser/esm/sync";
import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import useStore from "../store";
import { getRandomData } from "../utils";
import axios from "axios";

const columns = [
  {
    title: "№",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "FIO",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Phone",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

export default () => {
  const {
    region,
    seed,
    inaccurateNumErrors,
    page,
    setRegion,
    setSeed,
    setInaccurateNumErrors,
    setPage,
  } = useStore();

  const [data, setData] = useState([]);

  useEffect(() => {
    setPage(1);
    setData(getRandomData());
  }, [region, seed, inaccurateNumErrors]);

  useEffect(() => {
    const handler = () => {
      let documentHeight = document.body.scrollHeight;
      let currentScroll = window.scrollY + window.innerHeight;
      let modifier = 1;

      if (currentScroll + modifier > documentHeight) {
        setPage(page + 1);
        setData([...data, ...getRandomData()]);
      }
    };

    document.addEventListener("scroll", handler);

    return () => document.removeEventListener("scroll", handler);
  }, [region, page, seed, data]);

  const handleClick = () => {
    setPage(1);
    setData(getRandomData());
  };

  const handleLoadCSV = async () => {
    const response = await axios.post("/api/csv", {
      data: data.map((record) => Object.values(record)),
    });

    const aEl = document.createElement("a");

    aEl.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(response.data.csv)
    );
    aEl.setAttribute("download", "file.csv");

    aEl.style.display = "none";

    document.body.appendChild(aEl);

    aEl.click();

    document.body.removeChild(aEl);
  };

  return (
    <div className="mx-auto py-[40px] px-[22px]">
      <Typography.Title level={1} className="text-center">
        Random
      </Typography.Title>
      <Select
        className="w-full"
        defaultValue={region}
        onChange={(to) => setRegion(to)}
      >
        <Select.Option value="russia">Russian</Select.Option>
        <Select.Option value="england">England</Select.Option>
        <Select.Option value="uzbekistan">Uzbekistan</Select.Option>
      </Select>

      <div className="mt-[10px] flex items-center gap-[10px]">
        <Slider
          className="grow"
          min={0}
          max={1000}
          value={inaccurateNumErrors}
          onChange={(to) => setInaccurateNumErrors(to)}
        />
        <InputNumber
          onChange={(to) => setInaccurateNumErrors(to)}
          value={inaccurateNumErrors}
          min={0}
          max={1000}
        />
      </div>

      <div className="mt-[10px] flex items-center gap-[10px]">
        <Input
          className="grow"
          onChange={(e) => setSeed(e.target.value)}
          value={seed}
          placeholder="Seed"
        />
        <Button onClick={handleLoadCSV} type="primary">
          Load CSV
        </Button>
        <Button onClick={handleClick} type="primary">
          Random
        </Button>
      </div>

      <Table
        className="mt-[20px]"
        pagination={false}
        dataSource={data.map((item, i) => ({ index: i + 1, ...item, key: i }))}
        columns={columns}
      />
    </div>
  );
};
