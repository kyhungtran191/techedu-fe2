import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar'
import Navigate from '@/icons/Navigate'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GetCategoriesWithSubCategories } from '@/services/categories'
import { Category, CategoryAll } from '@/@types/category.type'
import { SubCategory } from '@/@types/instructor/course/landing-page'

interface IProps {
  className?: string
}
export default function CategoriesMenu({ className }: IProps) {
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useQuery(['categories-all'], GetCategoriesWithSubCategories, {
    initialData: () => queryClient.getQueryData(['categories-all']),
    select: (data) => data.data.value,
    staleTime: Infinity,
    cacheTime: Infinity
  })

  console.log(categories)
  return (
    <Menubar className={`border-none ${className}`}>
      <MenubarMenu>
        <MenubarTrigger className='bg-transparent cursor-pointer text-[18px] text-primary-1 '>
          Categories
        </MenubarTrigger>
        <MenubarContent className='flex items-start p-0 gap-x-3 '>
          <div className='py-[18px] px-3 rounded-xl w-[242px]'>{renderCategoryMenu(categories || [])}</div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

const renderCategoryMenu = (categories: CategoryAll[]) => {
  return categories.map((category: any) => (
    <Menubar className='mb-4 border-none'>
      <MenubarMenu key={category.primaryId || category.subcategoryId}>
        <MenubarTrigger className='bg-transparent cursor-pointer text-[18px] text-neutral-black p-0 flex items-center justify-between w-full'>
          <Link
            to={`${category.subcategoryId ? `?subcategory=${category.subcategoryId}` : `?category=${category.primaryId}`}`}
            className='hover:text-primary-1'
          >
            {category.displayName}
          </Link>

          {!category.subcategoryId && <Navigate className='rotate-180'></Navigate>}
        </MenubarTrigger>

        {category.subCategories.length > 0 && (
          <MenubarContent
            side='right'
            sideOffset={22}
            alignOffset={-26}
            className='!p-0 shadow-lg'
            onMouseLeave={(e) => e?.currentTarget?.parentElement?.blur()}
          >
            <div className='py-[18px] px-3 rounded-xl min-w-[242px]'>{renderCategoryMenu(category.subCategories)}</div>
          </MenubarContent>
        )}
      </MenubarMenu>
    </Menubar>
  ))
}
