"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

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
const color = {
    "0": "#1b9e77",
    "1": "#d95f02",
    "2": "#7570b3",
    "3": "#e7298a",
    "4": "#666666",
    "5": "#1a1a1a"
}



const data = [
    {
        "id": "group A",
        "data": [
            {
                "x": 5,
                "y": 110
            },
            {
                "x": 26,
                "y": 64
            },
            {
                "x": 15,
                "y": 48
            },
            {
                "x": 42,
                "y": 3
            },
            {
                "x": 90,
                "y": 112
            },
            {
                "x": 91,
                "y": 63
            },
            {
                "x": 5,
                "y": 11
            },
            {
                "x": 86,
                "y": 92
            },
            {
                "x": 31,
                "y": 108
            },
            {
                "x": 65,
                "y": 1
            },
            {
                "x": 11,
                "y": 95
            },
            {
                "x": 45,
                "y": 87
            },
            {
                "x": 49,
                "y": 69
            },
            {
                "x": 87,
                "y": 104
            },
            {
                "x": 28,
                "y": 17
            },
            {
                "x": 41,
                "y": 112
            },
            {
                "x": 27,
                "y": 20
            },
            {
                "x": 69,
                "y": 60
            },
            {
                "x": 76,
                "y": 11
            },
            {
                "x": 21,
                "y": 56
            },
            {
                "x": 81,
                "y": 31
            },
            {
                "x": 25,
                "y": 76
            },
            {
                "x": 56,
                "y": 84
            },
            {
                "x": 4,
                "y": 58
            },
            {
                "x": 80,
                "y": 47
            },
            {
                "x": 35,
                "y": 49
            },
            {
                "x": 5,
                "y": 44
            },
            {
                "x": 0,
                "y": 62
            },
            {
                "x": 62,
                "y": 116
            },
            {
                "x": 44,
                "y": 65
            },
            {
                "x": 16,
                "y": 87
            },
            {
                "x": 57,
                "y": 74
            },
            {
                "x": 38,
                "y": 7
            },
            {
                "x": 39,
                "y": 6
            },
            {
                "x": 76,
                "y": 103
            },
            {
                "x": 10,
                "y": 96
            },
            {
                "x": 7,
                "y": 29
            },
            {
                "x": 64,
                "y": 16
            },
            {
                "x": 32,
                "y": 100
            },
            {
                "x": 73,
                "y": 24
            },
            {
                "x": 62,
                "y": 71
            },
            {
                "x": 65,
                "y": 97
            },
            {
                "x": 43,
                "y": 63
            },
            {
                "x": 57,
                "y": 26
            },
            {
                "x": 60,
                "y": 75
            },
            {
                "x": 88,
                "y": 32
            },
            {
                "x": 97,
                "y": 117
            },
            {
                "x": 75,
                "y": 41
            },
            {
                "x": 96,
                "y": 92
            },
            {
                "x": 33,
                "y": 21
            }
        ]
    },
    {
        "id": "group B",
        "data": [
            {
                "x": 62,
                "y": 41
            },
            {
                "x": 51,
                "y": 17
            },
            {
                "x": 14,
                "y": 74
            },
            {
                "x": 3,
                "y": 98
            },
            {
                "x": 33,
                "y": 6
            },
            {
                "x": 50,
                "y": 72
            },
            {
                "x": 14,
                "y": 90
            },
            {
                "x": 23,
                "y": 18
            },
            {
                "x": 40,
                "y": 39
            },
            {
                "x": 2,
                "y": 12
            },
            {
                "x": 66,
                "y": 99
            },
            {
                "x": 87,
                "y": 16
            },
            {
                "x": 35,
                "y": 43
            },
            {
                "x": 47,
                "y": 68
            },
            {
                "x": 43,
                "y": 74
            },
            {
                "x": 22,
                "y": 70
            },
            {
                "x": 69,
                "y": 118
            },
            {
                "x": 81,
                "y": 17
            },
            {
                "x": 34,
                "y": 80
            },
            {
                "x": 99,
                "y": 37
            },
            {
                "x": 52,
                "y": 117
            },
            {
                "x": 74,
                "y": 73
            },
            {
                "x": 27,
                "y": 57
            },
            {
                "x": 94,
                "y": 41
            },
            {
                "x": 49,
                "y": 72
            },
            {
                "x": 3,
                "y": 92
            },
            {
                "x": 83,
                "y": 49
            },
            {
                "x": 72,
                "y": 110
            },
            {
                "x": 26,
                "y": 33
            },
            {
                "x": 39,
                "y": 71
            },
            {
                "x": 1,
                "y": 8
            },
            {
                "x": 37,
                "y": 111
            },
            {
                "x": 79,
                "y": 36
            },
            {
                "x": 13,
                "y": 55
            },
            {
                "x": 41,
                "y": 59
            },
            {
                "x": 41,
                "y": 88
            },
            {
                "x": 41,
                "y": 110
            },
            {
                "x": 72,
                "y": 74
            },
            {
                "x": 1,
                "y": 109
            },
            {
                "x": 69,
                "y": 82
            },
            {
                "x": 88,
                "y": 42
            },
            {
                "x": 73,
                "y": 22
            },
            {
                "x": 23,
                "y": 23
            },
            {
                "x": 68,
                "y": 23
            },
            {
                "x": 70,
                "y": 50
            },
            {
                "x": 19,
                "y": 86
            },
            {
                "x": 84,
                "y": 30
            },
            {
                "x": 98,
                "y": 30
            },
            {
                "x": 88,
                "y": 6
            },
            {
                "x": 98,
                "y": 69
            }
        ]
    },
    {
        "id": "group C",
        "data": [
            {
                "x": 92,
                "y": 70
            },
            {
                "x": 28,
                "y": 78
            },
            {
                "x": 57,
                "y": 29
            },
            {
                "x": 61,
                "y": 119
            },
            {
                "x": 73,
                "y": 101
            },
            {
                "x": 49,
                "y": 21
            },
            {
                "x": 72,
                "y": 22
            },
            {
                "x": 35,
                "y": 42
            },
            {
                "x": 18,
                "y": 113
            },
            {
                "x": 77,
                "y": 45
            },
            {
                "x": 6,
                "y": 47
            },
            {
                "x": 47,
                "y": 48
            },
            {
                "x": 17,
                "y": 32
            },
            {
                "x": 6,
                "y": 51
            },
            {
                "x": 51,
                "y": 53
            },
            {
                "x": 34,
                "y": 7
            },
            {
                "x": 94,
                "y": 72
            },
            {
                "x": 56,
                "y": 116
            },
            {
                "x": 48,
                "y": 101
            },
            {
                "x": 25,
                "y": 67
            },
            {
                "x": 51,
                "y": 91
            },
            {
                "x": 54,
                "y": 100
            },
            {
                "x": 17,
                "y": 85
            },
            {
                "x": 81,
                "y": 38
            },
            {
                "x": 25,
                "y": 78
            },
            {
                "x": 36,
                "y": 44
            },
            {
                "x": 30,
                "y": 112
            },
            {
                "x": 48,
                "y": 86
            },
            {
                "x": 4,
                "y": 54
            },
            {
                "x": 22,
                "y": 23
            },
            {
                "x": 74,
                "y": 62
            },
            {
                "x": 33,
                "y": 71
            },
            {
                "x": 64,
                "y": 119
            },
            {
                "x": 72,
                "y": 65
            },
            {
                "x": 21,
                "y": 32
            },
            {
                "x": 53,
                "y": 69
            },
            {
                "x": 56,
                "y": 85
            },
            {
                "x": 29,
                "y": 18
            },
            {
                "x": 79,
                "y": 45
            },
            {
                "x": 12,
                "y": 118
            },
            {
                "x": 37,
                "y": 113
            },
            {
                "x": 55,
                "y": 106
            },
            {
                "x": 83,
                "y": 45
            },
            {
                "x": 10,
                "y": 13
            },
            {
                "x": 56,
                "y": 4
            },
            {
                "x": 4,
                "y": 117
            },
            {
                "x": 90,
                "y": 90
            },
            {
                "x": 85,
                "y": 74
            },
            {
                "x": 79,
                "y": 118
            },
            {
                "x": 65,
                "y": 26
            }
        ]
    },
    {
        "id": "group D",
        "data": [
            {
                "x": 43,
                "y": 95
            },
            {
                "x": 77,
                "y": 19
            },
            {
                "x": 92,
                "y": 33
            },
            {
                "x": 95,
                "y": 58
            },
            {
                "x": 89,
                "y": 40
            },
            {
                "x": 83,
                "y": 57
            },
            {
                "x": 39,
                "y": 31
            },
            {
                "x": 37,
                "y": 22
            },
            {
                "x": 10,
                "y": 105
            },
            {
                "x": 62,
                "y": 4
            },
            {
                "x": 53,
                "y": 89
            },
            {
                "x": 0,
                "y": 77
            },
            {
                "x": 19,
                "y": 36
            },
            {
                "x": 97,
                "y": 53
            },
            {
                "x": 34,
                "y": 65
            },
            {
                "x": 41,
                "y": 116
            },
            {
                "x": 12,
                "y": 109
            },
            {
                "x": 98,
                "y": 26
            },
            {
                "x": 15,
                "y": 70
            },
            {
                "x": 10,
                "y": 76
            },
            {
                "x": 91,
                "y": 83
            },
            {
                "x": 14,
                "y": 112
            },
            {
                "x": 98,
                "y": 24
            },
            {
                "x": 44,
                "y": 36
            },
            {
                "x": 98,
                "y": 106
            },
            {
                "x": 19,
                "y": 71
            },
            {
                "x": 78,
                "y": 79
            },
            {
                "x": 82,
                "y": 72
            },
            {
                "x": 79,
                "y": 118
            },
            {
                "x": 77,
                "y": 89
            },
            {
                "x": 43,
                "y": 104
            },
            {
                "x": 20,
                "y": 76
            },
            {
                "x": 94,
                "y": 29
            },
            {
                "x": 93,
                "y": 6
            },
            {
                "x": 65,
                "y": 69
            },
            {
                "x": 82,
                "y": 84
            },
            {
                "x": 41,
                "y": 114
            },
            {
                "x": 21,
                "y": 97
            },
            {
                "x": 86,
                "y": 38
            },
            {
                "x": 67,
                "y": 27
            },
            {
                "x": 8,
                "y": 86
            },
            {
                "x": 88,
                "y": 54
            },
            {
                "x": 69,
                "y": 81
            },
            {
                "x": 10,
                "y": 60
            },
            {
                "x": 73,
                "y": 100
            },
            {
                "x": 61,
                "y": 5
            },
            {
                "x": 47,
                "y": 93
            },
            {
                "x": 6,
                "y": 92
            },
            {
                "x": 48,
                "y": 23
            },
            {
                "x": 27,
                "y": 27
            }
        ]
    },
    {
        "id": "group E",
        "data": [
            {
                "x": 43,
                "y": 52
            },
            {
                "x": 76,
                "y": 63
            },
            {
                "x": 70,
                "y": 76
            },
            {
                "x": 75,
                "y": 96
            },
            {
                "x": 77,
                "y": 57
            },
            {
                "x": 44,
                "y": 119
            },
            {
                "x": 94,
                "y": 90
            },
            {
                "x": 63,
                "y": 51
            },
            {
                "x": 11,
                "y": 75
            },
            {
                "x": 68,
                "y": 83
            },
            {
                "x": 46,
                "y": 47
            },
            {
                "x": 80,
                "y": 9
            },
            {
                "x": 84,
                "y": 48
            },
            {
                "x": 73,
                "y": 90
            },
            {
                "x": 44,
                "y": 70
            },
            {
                "x": 67,
                "y": 14
            },
            {
                "x": 15,
                "y": 48
            },
            {
                "x": 24,
                "y": 10
            },
            {
                "x": 83,
                "y": 87
            },
            {
                "x": 58,
                "y": 30
            },
            {
                "x": 87,
                "y": 107
            },
            {
                "x": 31,
                "y": 89
            },
            {
                "x": 64,
                "y": 57
            },
            {
                "x": 26,
                "y": 31
            },
            {
                "x": 79,
                "y": 73
            },
            {
                "x": 57,
                "y": 78
            },
            {
                "x": 61,
                "y": 57
            },
            {
                "x": 33,
                "y": 94
            },
            {
                "x": 5,
                "y": 19
            },
            {
                "x": 38,
                "y": 85
            },
            {
                "x": 70,
                "y": 57
            },
            {
                "x": 70,
                "y": 56
            },
            {
                "x": 54,
                "y": 32
            },
            {
                "x": 63,
                "y": 48
            },
            {
                "x": 80,
                "y": 13
            },
            {
                "x": 0,
                "y": 51
            },
            {
                "x": 5,
                "y": 50
            },
            {
                "x": 30,
                "y": 18
            },
            {
                "x": 99,
                "y": 51
            },
            {
                "x": 69,
                "y": 60
            },
            {
                "x": 93,
                "y": 96
            },
            {
                "x": 99,
                "y": 106
            },
            {
                "x": 92,
                "y": 10
            },
            {
                "x": 19,
                "y": 94
            },
            {
                "x": 88,
                "y": 11
            },
            {
                "x": 97,
                "y": 67
            },
            {
                "x": 99,
                "y": 56
            },
            {
                "x": 75,
                "y": 2
            },
            {
                "x": 69,
                "y": 101
            },
            {
                "x": 11,
                "y": 70
            }
        ]
    }
]

const companiesforcluster = locations.companies.map((company) => {
    return {
        "id": company.color,
        "name": "test",
        "data": [
            {
                "x": company.position[0],
                "y": company.position[1],
            }
        ]


    }
})
export default function ClusterPage() {

    return (
        <>
            <div className="flex h-screen w-full items-center justify-around space-x-12 p-12">
                <div className="h-full w-6/12 rounded-lg bg-white p-8 shadow-lg">
                    <ResponsiveScatterPlot
                        colors={{ scheme: 'dark2' }}
                        data={companiesforcluster}
                        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                        xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                        xFormat=">-.2f"
                        yScale={{ type: 'linear', min: "auto", max: 'auto' }}
                        yFormat=">-.2f"
                        blendMode="multiply"
                        axisTop={null}
                        axisRight={null}
                        nodeSize={20}
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
                <div className="h-full w-6/12 overflow-hidden rounded-lg bg-white shadow-lg">
                    <Map
                        provider={osm}
                        defaultZoom={10.5}
                        defaultCenter={[
                            49.4,
                            6.9
                        ]}
                    >
                        {locations.companies.map((company) => (
                            <Marker
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
            </div>
        </>
    )
}
