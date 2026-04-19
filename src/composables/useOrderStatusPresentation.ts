import { useI18n } from 'vue-i18n'
import type { OrderStatus } from '@/api'

export type OrderStatusSeverity = 'secondary' | 'info' | 'warn' | 'success' | 'danger'

interface OrderStatusConfig {
  severity: OrderStatusSeverity
}

const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  PLACED: { severity: 'secondary' },
  PROCESSING: { severity: 'info' },
  SHIPPED: { severity: 'warn' },
  READY_FOR_PICKUP: { severity: 'warn' },
  DELIVERED: { severity: 'success' },
  CANCELLED: { severity: 'danger' },
}

function isKnownOrderStatus(status: string): status is OrderStatus {
  return status in ORDER_STATUS_CONFIG
}

export function useOrderStatusPresentation() {
  const { t } = useI18n()

  function getOrderStatusMeta(status: string | OrderStatus) {
    const normalizedStatus = String(status ?? '')
      .trim()
      .toUpperCase()

    if (isKnownOrderStatus(normalizedStatus)) {
      return {
        key: normalizedStatus,
        label: t(`orderStatus.${normalizedStatus}`),
        severity: ORDER_STATUS_CONFIG[normalizedStatus].severity,
        known: true,
      }
    }

    return {
      key: 'UNKNOWN',
      label: t('orderStatus.UNKNOWN'),
      severity: 'secondary' as const,
      known: false,
    }
  }

  return {
    getOrderStatusMeta,
  }
}
