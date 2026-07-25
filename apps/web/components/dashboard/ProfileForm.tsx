'use client'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import { ImageUpload } from '@/components/common/ImageUpload'

const schema = z.object({
  firstName: z.string().min(2, 'Too short').max(50),
  lastName:  z.string().min(2, 'Too short').max(50),
  avatar:    z.string().url('Enter a valid image URL').optional().or(z.literal('')),
})
type F = z.infer<typeof schema>

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors disabled:opacity-60'
const labelClass = 'block text-bx-slate text-sm font-medium mb-1.5'

export function ProfileForm() {
  const { user, setUser } = useAuthStore()
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', avatar: user?.avatar ?? '' },
  })
  const avatarValue = useWatch({ control, name: 'avatar' })

  useEffect(() => {
    if (user) reset({ firstName: user.firstName, lastName: user.lastName, avatar: user.avatar ?? '' })
  }, [user, reset])

  if (!user) {
    return (
      <div className="bx-card rounded-2xl p-6 animate-pulse">
        <div className="h-4 w-1/3 bg-bx-border rounded mb-4" />
        <div className="h-10 w-full bg-bx-border rounded mb-3" />
        <div className="h-10 w-full bg-bx-border rounded" />
      </div>
    )
  }

  const onSubmit = async (data: F) => {
    setSaved(false)
    setServerError(null)
    try {
      const payload = { firstName: data.firstName, lastName: data.lastName, ...(data.avatar ? { avatar: data.avatar } : {}) }
      const { data: res } = await apiClient.put('/users/me', payload)
      setUser(res.data)
      setSaved(true)
      toast.success('Profile updated')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      const finalMessage = message ?? 'Could not update your profile. Please try again.'
      setServerError(finalMessage)
      toast.error(finalMessage)
    }
  }

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div className="space-y-6">
      <div className="bx-card rounded-2xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-bx-blue/15 flex items-center justify-center text-bx-blue-light text-xl font-bold overflow-hidden shrink-0">
          {user.avatar
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
            : initials}
        </div>
        <div className="min-w-0">
          <p className="text-bx-white font-semibold truncate">{user.firstName} {user.lastName}</p>
          <p className="text-bx-muted text-sm truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-bx-blue/15 text-bx-blue-light">{user.role.replace('_', ' ')}</span>
            {user.isEmailVerified && (
              <span className="flex items-center gap-1 text-xs text-bx-green-light"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="bx-card rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <input id="firstName" type="text" {...register('firstName')} className={inputClass} />
            {errors.firstName && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <input id="lastName" type="text" {...register('lastName')} className={inputClass} />
            {errors.lastName && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input id="email" type="email" value={user.email} disabled className={inputClass} />
          <p className="mt-1 text-xs text-bx-muted">Contact support to change your email.</p>
        </div>

        <div>
          <label className={labelClass}>Avatar</label>
          <ImageUpload
            value={avatarValue}
            onChange={(url) => setValue('avatar', url, { shouldDirty: true })}
            shape="circle"
            size={72}
          />
          {errors.avatar && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.avatar.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="flex items-center gap-2 text-sm text-bx-red">
            <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
          </p>
        )}
        {saved && !isDirty && (
          <p className="flex items-center gap-2 text-sm text-bx-green-light">
            <CheckCircle className="w-4 h-4 shrink-0" /> Profile updated
          </p>
        )}

        <button type="submit" disabled={isSubmitting || !isDirty}
          className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
