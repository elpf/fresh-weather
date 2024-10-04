import { Handlers, PageProps } from "$fresh/server.ts";

interface Data {
  result: WeatherResp | null;
}

interface WeatherResp {
  location: WeatherLocation;
  current: WeatherCurrent;
}

interface WeatherLocation {
  name: string;
  country: string;
}

interface WeatherCurrent {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  humidity: number;
  feelslike_c: number;
  precip_mm: number;
  wind_kph: number;
  uv: number;
  gust_kph: number;
}

interface WeatherCondition {
  icon: string;
  text: string;
}



// const env = config();
// const apiKey = env.WEATHER_API_KEY;

// export const handler: Handlers<Data> = {
//   async GET(req, ctx) {
//     const url = new URL(req.url);
//     const query = url.searchParams.get("q") || "Jakarta";
//     const resp = await fetch(
//       `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`
//     );

//     if (resp.status == 200) {
//       const result: WeatherResp = await resp.json();
//       return ctx.render({ result });
//     }
//     return ctx.render({ result: null });
//   },
// };

const apiKey = Deno.env.get("WEATHER_API_KEY");
export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "Jakarta";
    const resp = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`
    );

    // const data = await resp.json()
    // console.log(data)
    // return ctx.render()

    if (resp.status == 200) {
      const result: WeatherResp = await resp.json();
      return ctx.render({ result });
    }
    return ctx.render({ result: null });
  },
};


function Weather({ result }: Data) {
  if (!result) {
    return (
      <div class="m-10">
        <h2 class="text-center text-2xl font-bold">City not found!</h2>
        <img src="/not_found.svg" alt="" class="mx-auto" />
      </div>
    );
  }

  return (
    <div class="text-center">
      <div class="mx-auto p-5">
        <div class="text-2xl font-bold"> {result.location.name} </div>
        <div class="text-xl"> {result.location.country} </div>
        <div class="text-4xl my-4"> {result.current.temp_c} °C </div>
        <div class="text-md"> {result.current.condition.text} </div>
        <img src={result.current.condition.icon} alt="Logo" class="mx-auto" />
      </div>

      <div class="bg-blue-800 rounded shadow p-10 grid grid-cols-2 gap-4">
        <div>Feels Like: {result.current.feelslike_c} °C</div>
        <div>Humidity: {result.current.humidity}%</div>
        <div>Wind: {result.current.wind_kph} kph</div>
        <div>Precipitation: {result.current.precip_mm} mm</div>
        <div>Current UV: {result.current.uv}</div>
        <div>Gust: {result.current.gust_kph} kph</div>
      </div>
    </div>
  );
}



export default function Home({ data }: PageProps<Data>) {
  return (
    <section>
      <div class="mt-10 px-5 rounded shadow bg-blue-400 mx-auto flex max-w-screen-md flex-col justify-center py-12">
        <div class="mx-auto max-w-sm w-full">
          <h2 class="text-2xl font-bold mb-5 text-center">Fresh Weathers!</h2>
          <form>
            <input
              name="q"
              type="text"
              placeholder="Enter a city. . ."
              required
              class="w-full rounded-md py-1.5 px-3.5 ring-1 ring-inset ring-gray-300 plkaceholder:text-gray-400"
            />
          </form>
        </div>
        <Weather result={data.result} />
      </div>
    </section>
  );
}
