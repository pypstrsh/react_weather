import {Weather} from "../types/Weather"
import {Info} from "./Info"
import {Component} from "react"
import {getDay} from "./utils/getDay"
import {getDate} from "./utils/getDate"
import {Input} from "./Input"

import css from "./app.module.css"
import humIcon from "../img/humidity-icon.svg"
import rainIcon from "../img/rain-icon.svg"
import windIcon from "../img/wind-icon.svg"
import temp from "./../img/icon_temperature.svg"
import { debounce } from "lodash";

interface AppState {
    weather: Weather;
    search: string;
    isLoading: boolean;
}

const myFetch = (url: string) => {
    return fetch(url).then((data) => {
        if (data.ok) {
            return data.json();
        }
        throw Error("oops");
    });
};




export class App extends Component<{}, AppState> {
    state: AppState = {
        weather: {
            main: {temp: 0, feels_like: 0, humidity: 0, sea_level: 0},
            wind: {speed: 0},
        },

        search: "Minsk",
        isLoading: false
    }


    componentDidMount() {
        myFetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.search}&appid=80705822dbebd2920f115f199483856f&units=metric`)
            .then((data) => this.setState(prev => ({
                ...prev,
                weather: {name: data.name, main: {...data.main}, wind: {...data.wind}}
            })))
    }

    fetchWeatherDebounced = debounce(this.componentDidMount, 1_500);


    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<AppState>, snapshot?: any): void {
        if (prevState.weather !== this.state.weather) {
            this.infoItems = [
                {
                    icon: humIcon,
                    label: "Humidity",
                    value: String(this.state.weather.main.humidity + "%"),
                },
                {
                    icon: rainIcon,
                    label: "Rain",
                    value: String(this.state.weather.main.sea_level + " m.o.m."),
                },
                {
                    icon: windIcon,
                    label: "Wind",
                    value: String(this.state.weather.wind.speed + " km/h"),
                },
            ];
        }
        if (prevState.search !== this.state.search) {
            this.fetchWeatherDebounced();
        }
    }

    infoItems: { icon?: any; label: string; value: string }[] = [
        {
            icon: humIcon,
            label: "Humidity",
            value: String(this.state.weather.main.humidity + "%"),
        },
        {
            // icon: rainIcon,
            label: "Rain",
            value: String(this.state.weather.main.sea_level + " m.o.m."),
        },
        {
            // icon: windIcon,
            label: "Wind",
            value: String(this.state.weather.wind.speed + " km/h"),
        },
    ];

    render() {
        return (
            <div className={css.main}>
                <div className={css.container}>
                    <div className={css.logo}>
                        <Input value={this.state.search} onChange={(search) => this.setState({search})}/>
                    </div>
                    <p className={css.temperature}>
                        <img src={temp}/>
                        {Math.round(this.state.weather?.main.temp!)}&#176;C
                    </p>
                    <span className={css.temp_feel}>


                        feels like {Math.round(this.state.weather?.main.feels_like!)} &#176;C
                    </span>
                    <div className={css.day_container}>
                        <p className={css.date}>{getDate()},</p>
                        <p className={css.day}>
                            {getDay()}
                        </p>
                    </div>
                    <ul className={css.list}>
                        {this.infoItems.map((item, index) => (
                            <Info
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
