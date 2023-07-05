"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { animated } from '@react-spring/web'

import { Map, GeoJson, Marker } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import locations from "public/locations.json"
import { Pin, PinIcon } from "lucide-react"
import { DataTableDemo } from "./data-table"
import { useState } from "react"

import { create } from 'zustand'

type Consultancy = {
    name: string
}

type ConsultancyFilter = {
    filter: Consultancy[]
    add: (s: Consultancy) => void
    remove: (a: Consultancy) => void
}

export const useStore = create<ConsultancyFilter>()((set) => ({
    filter: [{ name: "Orbis AG" }],
    add: (s) => set((state) => {
        let found = false
        for (var i = 0; i < state.filter.length; i++) {
            if (state.filter[i].name == s.name) {
                found = true
                break
            }
        }
        if (found) {
            console.log("included")
            return { filter: state.filter.filter(pre => pre.name != s.name) }
        } else {

            return { filter: state.filter.concat(s) }
        }
    }
    )
    ,
    remove: (s) => set((state) => ({ filter: state.filter.filter(pre => pre.name != s.name) })),

}))




const color = {
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




export default function ClusterPage() {
    const { add } = useStore()

    const [companies, setCompanies] = useState(locations.companies)
    const [plotColors, setPlotColors] = useState(Object.values(color))
    const [currentCompany, setCurrentCompany] = useState("")

    function highlightCompany(id: string) {
        if (currentCompany == id) {
            resetHighlight()
            resetCompanies()
            setCurrentCompany("")
            return
        }

        setCurrentCompany(id)
        resetHighlight()
        setPlotColors(colors.map((color) => {
            return color.id == id ? color.color : "#AAAAAA"
        }))

        resetCompanies()
        setCompanies(locations.companies.map((company) => {
            return company.color == id ? { ...company } : { ...company, color: "#AAAAAA" }
        }))

    }

    function resetHighlight() {
        setPlotColors(Object.values(color))
    }

    function resetCompanies() {
        setCompanies(locations.companies)
    }



    return (
        <>
            <div className="grid grid-cols-4 gap-4 h-screen grid-rows-6  p-12">
                <div className="col-span-2 row-span-4   rounded-lg bg-white p-8 shadow-lg">
                    <ResponsiveScatterPlot
                        colors={plotColors}
                        data={companiesforcluster}
                        margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
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
                        }}
                        nodeComponent={(props, index) => (
                            <animated.circle
                                key={index}
                                className={"cursor-pointer"}
                                cx={props.style.x}
                                cy={props.style.y}
                                fill={props.style.color}
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
                                    console.log(prop)
                                    highlightCompany(prop.id.toString())
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
                                    <Pin style={{ "color": color[company.color] }} />
                                    <p className="text-center group-hover:visible" >{company.name}</p>
                                </div>
                            </Marker>
                        )
                        )
                        }

                    </Map >
                </div>
                <div className="col-span-4 row-span-2 bg-white  rounded-lg shadow-lg px-12 ">
                    <DataTableDemo />
                </div>
            </div>
        </>
    )
}
