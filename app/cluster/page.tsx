"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { animated } from '@react-spring/web'
import { ResponsiveBar } from '@nivo/bar'
import { Map, GeoJson, Marker } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import locations from "public/locations.json"
import customers from "public/companies.json"
import { Pin, PinIcon } from "lucide-react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { DataTableDemo } from "./data-table"
import { useEffect, useState } from "react"

import { create } from 'zustand'
import { OpacityIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { flushSync } from "react-dom"
import { ResponsivePie } from '@nivo/pie'

import { filterFns } from "@tanstack/react-table"
import { useFilter } from "@/store/filter"

type Consultancy = {
    name: string
}

type ConsultancyFilter = {
    filter: Consultancy[]
    add: (s: Consultancy) => void
    remove: (a: Consultancy) => void
    clear: () => void
}






const color: { [key: string]: string } = {
    "0": "#7570b3",
    "1": "#1b9e77",
    "2": "#d95f02",
    "3": "#e7298a",
    "4": "#666666",
    "5": "#1a1a1a"
}
const colors = [{ id: "0", color: "#7570b3" }, { id: "1", color: "#1b9e77" }, { id: "2", color: "#d95f02" }, { id: "3", color: "#e7298a" }, { id: "4", color: "#666666" }, { id: "5", color: "#1a1a1a" }]


interface companyEntry {
    id: string;
    name: string;
    data: [{
        name: string;
        x: number;
        y: number;
    }]
}

const companiesforcluster: companyEntry[] = [];

const industries: string[] = []
customers.forEach((customer) => {
    if (!industries.includes(customer.industry)) {
        industries.push(customer.industry)
    }
})


locations.companies.forEach((company) => {
    let comp = companiesforcluster.find((comp) => comp.id === company.color);
    if (comp) {
        comp.data.push({
            name: company.name,
            x: company.position[0],
            y: company.position[1],
        })
    } else {
        companiesforcluster.push({
            id: company.color,
            name: company.name,
            data: [
                {
                    name: company.name,
                    x: company.position[0],
                    y: company.position[1],
                }
            ]
        })
    }
})
companiesforcluster.sort((a, b) => a.id.localeCompare(b.id))

interface city{
    name: string;
    long: number;
    lat: number;
}
const cities: city[] = [
    {name: "Saarbrücken", lat: 49.237783, long: 6.997024},
    {name: "Saarlouis", lat: 49.313611, long: 6.752778},
    {name: "Merzig", lat: 49.443056, long: 6.636111},
    {name: "Neunkirchen", lat: 49.346667, long: 7.179722},
    {name: "Homburg", lat: 49.316667, long: 7.333333},
    {name: "St. Wendel", lat: 49.466667, long: 7.166667},
    {name: "Völklingen", lat: 49.25, long: 6.833333},
    {name: "Dillingen", lat: 49.35, long: 6.733333},
    {name: "Wadern", lat: 49.55, long: 6.883333},
    {name: "St. Ingbert", lat: 49.282544, long: 7.110980}]

interface customerEntry {
    id: string;
    name: string;
    conultancy: string;
    industry: string;
    endcustomer: string;
    long: number;
    lat: number;
}

const potentialCustomers:customerEntry[] = []
let optimalCity:city = {name: "", lat: 0, long: 0}
function determineOptimalLocation(cluster: string) {
    let x = 0
    let y = 0
    const companiesInCluster = locations.companies.filter((company) => company.color === cluster).map((company) => company.name)
    customers.forEach((customer) => {
        //check if customer is in cluster
        let rightCluster = companiesInCluster.includes(customer.consultancy)
        //check if customer is in saarland
        let closeToSaarland =  48.734792 < customer.lat && customer.lat < 49.878017 && 5.839988 < customer.long && customer.long < 7.948665
        // let closeToSaarland = true

        if (rightCluster && closeToSaarland) {
            potentialCustomers.push({
                id: customer.id,
                name: customer.name,
                conultancy: customer.consultancy,
                industry: customer.industry,
                endcustomer: customer.endcustomer,
                long: customer.long,
                lat: customer.lat
            })
        }
    })
    potentialCustomers.forEach((customer) => {
        x += customer.long
        y += customer.lat
    })
    x = x / potentialCustomers.length
    y = y / potentialCustomers.length

    //calculate distance to all cities and find closest
    const distances: { name: string, distance: number }[] = []
    cities.forEach((city) => {
        distances.push({name: city.name, distance :Math.sqrt(Math.pow(x - city.long, 2) + Math.pow(y - city.lat, 2))})
    })
    distances.sort((a, b) => a.distance - b.distance)
    optimalCity = cities.find((city) => city.name === distances[0].name)!

}
determineOptimalLocation("3")








export default function ClusterPage() {
    const { filter, add, clear, remove } = useFilter()
    const [consultancyFilter, setConsultancyFilter] = useState([{
        name: "Orbis AG"
    }, {
        name: "Pikon"
    }])

    const [piechartdata, setPieChart] = useState<{ "id": string, "label": string, "value": number }[]>([])
    const [potentialCustomers, setPotentialCustomers] = useState(0)
    const [companies, setCompanies] = useState(locations.companies)
    const [plotColors, setPlotColors] = useState(Object.values(color))
    const [selectedClusters, setSelectedClusters] = useState<string[]>([])

    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])

    const [barData, setBarData] = useState<{ [key: string]: string | number }[]>([{ "endcustomer": "B2B" }, { "endcustomer": "B2C" }])

    useEffect(() => {
        setSelectedCompanies(filter.map((f) => f.name))
    }, [filter])

    const [selectedIndustries, setSelectedIndustries] = useState<{ [key: string]: boolean }>(Object.fromEntries(industries.map((industry) => {
        return [industry, false]
    })))

    const [optimalLocation, setOptimalLocation] = useState<{name: string,lat: number, long: number}>(optimalCity)


    function resetIndustries() {
        setSelectedIndustries(Object.fromEntries(industries.map((industry) => {
            return [industry, false]
        })))
    }

    function filterByIndustry() {
        const companies: string[] = []
        customers.forEach((customer) => {
            if (industrySelected(customer.industry) && !companies.includes(customer.consultancy)) {
                companies.push(customer.consultancy)
            }
        })
        setSelectedClusters([])
        setSelectedCompanies(companies)
        update(companies)
    }

    function industrySelected(industry: string) {
        return selectedIndustries[industry]
    }

    function clearSelectedCompanies() {
        setSelectedCompanies([])
        update()
    }

    function addCompany(company: string) {
        if (!selectedCompanies.includes(company)) {
            selectedCompanies.push(company)
        }
        resetIndustries()
        update()
    }

    function removeCompany(company: string) {
        if (selectedCompanies.includes(company)) {
            selectedCompanies.splice(selectedCompanies.indexOf(company), 1)
        }
        resetIndustries()
        update()
    }

    function addCluster(cluster: string) {
        if (!selectedClusters.includes(cluster)) {
            selectedClusters.push(cluster)
            locations.companies.forEach((company) => {
                if (company.color == cluster) {
                    addCompany(company.name)
                }
            })
        } else {
            selectedClusters.splice(selectedClusters.indexOf(cluster), 1)
            locations.companies.forEach((company) => {
                if (company.color == cluster) {
                    removeCompany(company.name)
                }
            })
        }
        update()
    }

    function update(companies?: string[]) {
        add({ name: "cluster" })
        remove({ name: "cluster" })

        clear()
        if (companies) {
            companies.forEach((company) => {
                add({ name: company })
            })
        } else {
            selectedCompanies.forEach((company) => {
                add({ name: company })
            })
        }
    }

    function companySelected(company: string) {
        return selectedCompanies.includes(company) || selectedCompanies.length == 0
    }

    useEffect(() => {
        const test = filter.map(fil => {

            return customers.filter(e => e.consultancy == fil.name)
        })

        const bardata: { [key: string]: string | number }[] = [{ "endcustomer": "B2B" }, { "endcustomer": "B2C" }]

        const counts: { [key: string]: number } = {}



        var potentialcustoemr = 0
        for (const ele of test) {
            potentialcustoemr += ele.length
            for (const e of ele) {
                counts[e["industry"]] = counts[e["industry"]] ? counts[e["industry"]] + 1 : 1;

                if (e["endcustomer"] == "B2B") {
                    bardata[0][e["consultancy"]] = bardata[0][e["consultancy"]] ? bardata[0][e["consultancy"]] as number + 1 : 1
                } else if (e["endcustomer"] == "B2C") {
                    bardata[1][e["consultancy"]] = bardata[1][e["consultancy"]] ? bardata[1][e["consultancy"]] as number + 1 : 1
                } else {
                    bardata[1][e["consultancy"]] = bardata[1][e["consultancy"]] ? bardata[1][e["consultancy"]] as number + 1 : 1
                    bardata[0][e["consultancy"]] = bardata[0][e["consultancy"]] ? bardata[0][e["consultancy"]] as number + 1 : 1
                }
            }
        }

        setBarData(bardata)

        console.log(bardata)
        setPotentialCustomers(potentialcustoemr)
        console.log(counts)

        const industries = Object.keys(counts)

        const piechartdata = industries.map(e => {
            return {
                "id": e,
                "value": counts[e],
                "label": e
            }
        })

        setPieChart(piechartdata)

    }, [filter])




    return (
        <>
            <div className="grid grid-cols-4 gap-4 h-screen grid-rows-6  p-8">
                <div className="col-span-2 row-span-4   rounded-lg bg-white p-8 shadow-lg">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Industries <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.keys(selectedIndustries).map((industry) => {
                                return <DropdownMenuCheckboxItem
                                    key={industry}
                                    className="capitalize"
                                    checked={industrySelected(industry)}
                                    onCheckedChange={() => {
                                        if (industrySelected(industry)) {
                                            selectedIndustries[industry] = false
                                        } else {
                                            selectedIndustries[industry] = true
                                        }
                                        filterByIndustry()
                                    }}
                                >
                                    {industry}
                                </DropdownMenuCheckboxItem>
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ResponsiveScatterPlot
                        colors={plotColors}
                        data={companiesforcluster}
                        margin={{ top: 50, right: 100, bottom: 100, left: 100 }}
                        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                        xFormat=">-.2f"
                        yScale={{ type: 'linear', min: "auto", max: 'auto' }}
                        yFormat=">-.2f"
                        blendMode="multiply"
                        axisTop={null}
                        axisRight={null}
                        nodeSize={20}
                        onClick={(node, event) => {
                            add({ name: node.data.name })
                            if (selectedCompanies.includes(node.data.name)) {
                                removeCompany(node.data.name)
                            } else {
                                addCompany(node.data.name)
                            }
                        }}
                        nodeComponent={(props, index) => (
                            <animated.circle
                                key={index}
                                className={"cursor-pointer"}
                                cx={props.style.x}
                                cy={props.style.y}
                                fill={companySelected(props.node.data.name) ? props.style.color : "#AAAAAA"}
                                r={props.style.size.to(size => size / 2)}
                            />
                        )
                        }
                        tooltip={node => <div className="cursor-pointer p-2 font-medium bg-white shadow rounded">{node.node.data.name}</div>}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'weight',
                            legendPosition: 'middle',
                            legendOffset: 46
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'size',
                            legendPosition: 'middle',
                            legendOffset: -60
                        }}

                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 130,
                                translateY: 0,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemDirection: 'left-to-right',
                                symbolSize: 12,
                                onClick: (prop) => {
                                    addCluster(prop.id.toString())
                                },
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }

                                    }
                                ]
                            }
                        ]}
                    />
                </div>
                <div className="col-span-2 row-span-4  overflow-hidden rounded-lg bg-white shadow-lg">
                    <Map
                        provider={osm}
                        defaultZoom={10.5}
                        defaultCenter={[
                            49.4,
                            6.9
                        ]}
                    >
                        {companies.map((company, index) => (
                            <Marker
                                key={index}
                                width={40}
                                anchor={[company.location.lat, company.location.long]}
                                color={"#123123"}
                                offset={[-10, -20]}
                            >
                                <div className="group cursor-pointer z-50 flex items-center space-x-2 font-bold">
                                    <Pin style={{ color: companySelected(company.name) ? color[company.color] : "#FFFFFF", opacity: companySelected(company.name) ? 1.0 : 0.35 }} />
                                    <p className="text-center group-hover:visible" style={{ opacity: companySelected(company.name) ? 1.0 : 0.0 }}>{company.name}</p>
                                </div>
                            </Marker>
                        )
                        )
                        }
                        <Marker
                            key="optimalLocation"
                            width={40}
                            anchor={[optimalLocation.lat, optimalLocation.long]}
                            color={"#D4AF37"}
                            offset={[-10, -20]}
                        >
                            <div className="group cursor-pointer z-50 flex items-center space-x-2 font-bold">
                                <Pin style={{color: "#D4AF37"}} />
                                <h1 className="text-center group-hover:visible" style={{color: "#000000"}}>Optimal Location</h1>
                            </div>
                        </Marker>
                    </Map >
                </div>
                <div className="col-span-2 row-span-2 bg-white  rounded-lg shadow-lg px-12 ">
                    <DataTableDemo />
                </div>
                <div className="col-span-1 row-span-2 bg-white  rounded-lg shadow-lg px-4 ">
                    <ResponsivePie
                        data={piechartdata}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    0.2
                                ]
                            ]
                        }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    2
                                ]
                            ]
                        }}
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                size: 4,
                                padding: 1,
                                stagger: true
                            },
                            {
                                id: 'lines',
                                type: 'patternLines',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10
                            }
                        ]}
                        fill={[
                            {
                                match: {
                                    id: 'ruby'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'c'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'go'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'python'
                                },
                                id: 'dots'
                            },
                            {
                                match: {
                                    id: 'scala'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'lisp'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'elixir'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'javascript'
                                },
                                id: 'lines'
                            }
                        ]}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 18,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000'
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                </div>
                <div className="col-span-1 row-span-2 gap-4  grid grid-cols-2 grid-rows-2  rounded-lg  ">
                    <div className="row-span-1 col-span-1  bg-white rounded-lg shadow-lg p-2 flex justify-center items-center">
                        <div>
                            <h1 className="font-bold mb-8">Competitors</h1>
                            <p className="font-medium text-xl text-center ">{filter.length}</p>
                        </div>
                    </div>
                    <div className="row-span-1 flex justify-center items-center col-span-1  bg-white rounded-lg shadow-lg p-2 flex-row justify-center items-center">
                        <div>
                            <h1 className="font-bold mb-8">Potential Customers</h1>
                            <p className="font-medium text-xl text-center ">{
                                potentialCustomers
                            }</p>

                        </div>
                    </div>
                    <div className="row-span-1 col-span-1  bg-white rounded-lg shadow-lg p-2 w-full flex justify-center items-center">
                        <ResponsiveBar
                            data={barData}
                            indexBy="endcustomer"
                            margin={{ top: 0, right: 10, bottom: 20, left: 50 }}
                            padding={0.3}
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={{ scheme: 'nivo' }}
                            keys={filter.map(e => e.name)}
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: '#38bcb2',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: '#eed312',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}

                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        1.6
                                    ]
                                ]
                            }}
                            axisTop={null}
                            axisRight={null}

                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Amount',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        1.6
                                    ]
                                ]
                            }}

                            role="application"
                            ariaLabel="Nivo bar chart demo"
                            barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
                        />
                    </div>
                    <div className="row-span-1 col-span-1  bg-white rounded-lg shadow-lg p-2">

                    </div>
                </div>
            </div>
        </>
    )
}
