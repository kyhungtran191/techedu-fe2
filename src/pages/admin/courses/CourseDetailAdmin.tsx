import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Blocks, Check, Languages } from 'lucide-react'

import 'swiper/css'
import Instructor from '@/assets/instructor.jfif'
import Certificate from '@/icons/CourseDetail/Certificate'
import Clock from '@/icons/CourseDetail/Clock'
import Document from '@/icons/CourseDetail/Document'
import FolderNLine from '@/icons/CourseDetail/FolderNLine'
import Description from '@/pages/general/Courses/CourseDetail/components/Description'
import Star from '@/icons/CourseDetail/Star'
import StudentsTable from './components/StudentsTable'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid } from 'recharts'
import { useParams } from 'react-router-dom'
import PaginationCustom from '@/components/Pagination'
import AvatarPopover from '@/components/AvatarPopover'
import { useQuery } from '@tanstack/react-query'
import { GetPrivateDetailCourse } from '@/services/admin/private-course.service'
import SectionLoading from '@/components/Loading/SectionLoading'
export default function CourseDetailAdmin() {
  // Get Param
  const { id, instructorId } = useParams()
  // Call API get Detail Data

  const { data, isLoading } = useQuery({
    queryKey: ['private-admin-detail', id, instructorId],
    queryFn: () => GetPrivateDetailCourse(id as string, instructorId as string),
    enabled: Boolean(instructorId && id),
    select: (data) => data.data.value
  })

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 }
  ]

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#588E58'
    },
    mobile: {
      label: 'Mobile',
      color: '#B3E8B2'
    }
  } satisfies ChartConfig

  return (
    <>
      {isLoading && <SectionLoading className='z-30 h-screen'></SectionLoading>}
      <Layout className={`${isLoading ? 'h-screen' : 'h-auto'}`}>
        <Layout.Header>
          <div className='flex items-center ml-auto space-x-4'>
            <AvatarPopover />
          </div>
        </Layout.Header>
        <Layout.Body>
          <div className='flex items-center justify-between space-y-2'>
            <h1 className='text-2xl font-bold tracking-tight'>Course Detail</h1>
            <div className='flex items-center space-x-2'>
              <Button>Export to CSV</Button>
            </div>
          </div>
          <div className='grid gap-4 mt-3 lg:grid-rows-2 lg:grid-cols-3'>
            <Card className='shadow-lg lg:row-span-2 lg:col-span-2 '>
              <CardHeader className='flex flex-row items-center justify-start bg-neutral-silver'>
                <CardTitle className='flex items-center text-2xl font-semibold text-start'>
                  {data?.courseLandingPage.title}
                  <div className={`p-2 ml-2 text-sm text-white bg-primary-1 rounded-lg`}>{data?.courseStatus}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className='px-3 py-5'>
                <div className='grid items-stretch gap-5 tb:grid-cols-2'>
                  <img
                    src={data?.courseLandingPage.thumbnailUrl}
                    alt=''
                    className='object-cover w-full max-w-full rounded-lg h-[300px] shadow-lg'
                  />
                  <div className='flex flex-col justify-center'>
                    <Description
                      lineclamp={3}
                      wrapperClass='pb-4'
                      content={data?.courseLandingPage.shortDescription}
                    ></Description>
                    <div className='flex items-center gap-x-3'>
                      {/* <span className='text-2xl line-through text-neutral-silver-3'>$0</span> */}
                      <span className='text-[32px]'>${data?.price.amount}</span>
                      {/* <div className='p-2 rounded-md bg-[#F30000] text-center text-white uppercase'>20% OFF</div> */}
                    </div>
                  </div>
                </div>

                <div className='mt-5'>
                  <div className='hidden ms:flex items-center gap-[10px]'>
                    {data?.courseLandingPage.topics.map((item) => (
                      <div className='p-2 text-base text-center bg-white rounded-lg shadow-custom-shadow w-fit text-primary-1'>
                        {item.name}
                      </div>
                    ))}
                  </div>
                  <div className='mt-5'>
                    <div className=''>
                      <h3 className='mt-3 text-2xl font-medium text-neutral-black'>Video Promotion</h3>
                      <video
                        src={data?.courseLandingPage?.videoPromotionUrl}
                        controls
                        className='w-full h-[400px] mt-6'
                      ></video>
                    </div>
                    <div className=''>
                      <h3 className='mt-5 text-2xl font-medium text-neutral-black'>Instructor</h3>
                      <div className='flex items-start justify-between ms:items-center my-[18px]'>
                        <div className='flex items-start '>
                          <img
                            className='w-[50px] h-[50px] rounded-xl object-cover flex-shrink-0'
                            src={data?.instructor.avatarUrl}
                            alt='instructor-avatar'
                          />
                          <div className='ml-3'>
                            <h2 className='text-lg ms:text-xl text-primary-1'>
                              {data?.instructor.firstName} {data?.instructor.lastName}
                            </h2>
                            <div className='text-sm text-neutral-black text-ellipsis ms:text-base'>Instructor</div>
                          </div>
                        </div>
                        <Button variant={'outline'} className='px-3 py-1 ms:py-4 ms:px-6 border-neutral-black'>
                          View detail
                        </Button>
                      </div>
                    </div>
                    <h3 className='my-4 text-2xl font-bold'>Course Include</h3>
                    <div className='grid grid-cols-2 gap-5'>
                      <div>
                        <div className='flex items-center mb-6'>
                          <Clock className='text-neutral-black'></Clock>
                          <span className='ml-[10px] font-medium'>{data?.totalVieoDuration} on-demand video</span>
                        </div>
                        <div className='flex items-center mb-6'>
                          <Document className='text-neutral-black'></Document>
                          <span className='ml-[10px] font-medium'>{data?.totalSectionItems} lessons</span>
                        </div>
                        <div className='flex items-center mb-6'>
                          <FolderNLine className='text-neutral-black'></FolderNLine>
                          <span className='ml-[10px] font-medium'>{data?.totalResources} downloadable resources</span>
                        </div>
                        <div className='flex items-center mb-6'>
                          <Certificate className='text-neutral-black'></Certificate>
                          <span className='ml-[10px] font-medium'>Completion certificate</span>
                        </div>
                      </div>
                      <div>
                        <div className='flex items-center mb-6'>
                          <Blocks className='text-neutral-black'></Blocks>
                          <span className='ml-[10px] font-medium'>{data?.courseLandingPage.level}</span>
                        </div>
                        <div className='flex items-center mb-6'>
                          <Languages className='text-neutral-black'></Languages>
                          <span className='ml-[10px] font-medium'>{data?.courseLandingPage.language}</span>
                        </div>
                        <div className='flex items-center mb-6'>
                          <Star className='text-neutral-black'></Star>
                          <span className='ml-[10px] font-medium'>0 reviews</span>
                        </div>
                      </div>
                    </div>
                    <h3 className='my-4 text-2xl font-bold'>Description</h3>
                    <div
                      className='mb-6'
                      dangerouslySetInnerHTML={{ __html: data?.courseLandingPage.description || '' }}
                    ></div>
                    <h3 className='my-4 text-2xl font-bold'>What you'll learn</h3>
                    <div className='grid grid-cols-2 gap-10 p-5 mb-6'>
                      {data?.courseOverview?.highlights?.map((item) => (
                        <div className='flex items-center gap-4 p-4 shadow-custom-shadow'>
                          <Check className='w-5 h-5'></Check>
                          <p className='font-medium'>{item.text}</p>
                        </div>
                      ))}
                    </div>
                    <h3 className='my-4 text-2xl font-bold'>Requirement</h3>
                    <div>{data?.courseOverview.requirements[0].text}</div>
                    <h3 className='my-4 text-2xl font-bold'>Who This Course Is For</h3>
                    <div>{data?.courseOverview.intendedLearners[0].text}</div>
                    <h3 className='my-4 text-2xl font-bold'>Welcome Message</h3>
                    <div
                      className='p-4 mb-6 shadow-custom-shadow min-h-[150px]'
                      dangerouslySetInnerHTML={{ __html: data?.welcomeMessage || '' }}
                    ></div>
                    <h3 className='my-4 text-2xl font-bold'>Congratulation Message</h3>
                    <div
                      className='p-4 mb-6 shadow-custom-shadow min-h-[150px]'
                      dangerouslySetInnerHTML={{ __html: data?.congratulationMessage || '' }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>Total course earning</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-xs text-muted-foreground'>+19% from last month</p>
                  <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
                      <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className='mt-5'>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>New Enrollment This Month</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-4 h-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-xs text-muted-foreground'>+201 since last hour</p>
                  <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
                      <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='mt-5'>
            <h2 className='text-2xl font-bold tracking-tight'>Students</h2>
            <StudentsTable className='my-5'></StudentsTable>
            <PaginationCustom totalPage={50}></PaginationCustom>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}
